<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CategoryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\CategoryRelation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        // Exactly 3 queries — no N+1:
        // 1) Top-level categories (whereDoesntHave)
        // 2) Their children via pivot  (BelongsToMany eager-load)
        // 3) Each child's parent IDs  (nested eager-load for parent_ids)
        $topLevel = Category::query()
            ->with([
                'children' => fn ($q) => $q
                    ->with('parents:id')
                    ->orderBy('sort_order'),
            ])
            ->whereDoesntHave('parents')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('backend/Admin/category', [
            'categories'          => $this->formatTree($topLevel),
            'categoriesForSelect' => $topLevel
                ->map(fn (Category $c) => ['id' => $c->id, 'title' => $c->title])
                ->values()
                ->all(),
            'success' => session('success'),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data    = $request->validated();
        $adminId = auth('admin')->id();

        $category = Category::create([
            'title'      => $data['title'],
            'slug'       => $data['slug'],
            'sort_order' => 0,
            'status'     => CategoryStatus::ACTIVE,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        if (! empty($data['category_ids'])) {
            $category->parents()->sync(
                collect($data['category_ids'])
                    ->mapWithKeys(fn ($id, $index) => [$id => ['sort_order' => $index]])
                    ->all()
            );
        }

        return to_route('admin.categories.index')
            ->with('success', __('Category created successfully.'));
    }

    public function update(UpdateCategoryRequest $request, string $id): RedirectResponse
    {
        $category = Category::findOrFail($id);
        $data     = $request->validated();

        $category->update([
            'title'      => $data['title'],
            'slug'       => $data['slug'],
            'updated_by' => auth('admin')->id(),
        ]);

        // sync() handles attach / detach / pivot-update in one query.
        $category->parents()->sync(
            collect($data['category_ids'] ?? [])
                ->mapWithKeys(fn ($catId, $index) => [$catId => ['sort_order' => $index]])
                ->all()
        );

        return to_route('admin.categories.index')
            ->with('success', __('Category updated successfully.'));
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $parentId = $request->query('parent_id');

        // ── Subcategory removal path ────────────────────────────────────────
        if ($parentId !== null) {
            // Remove only the specific parent → child pivot row.
            CategoryRelation::where('category_id', $parentId)
                ->where('sub_category_id', $id)
                ->delete();

            // If the child still belongs to other parents, just unlink it.
            if (CategoryRelation::where('sub_category_id', $id)->exists()) {
                return to_route('admin.categories.index')
                    ->with('success', __('Subcategory removed from category.'));
            }

            // No parents left — fully delete the now-orphaned subcategory.
            if ($child = Category::find($id)) {
                $this->deleteCategory($child);
            }

            return to_route('admin.categories.index')
                ->with('success', __('Subcategory deleted.'));
        }

        // ── Top-level category deletion path ────────────────────────────────
        $category = Category::with('children')->findOrFail($id);

        DB::transaction(function () use ($category) {
            // Delete all children first (each child may also have products).
            foreach ($category->children as $child) {
                // Only fully delete children that have no other parents.
                $otherParents = CategoryRelation::where('sub_category_id', $child->id)
                    ->where('category_id', '!=', $category->id)
                    ->exists();

                if (! $otherParents) {
                    $this->deleteCategory($child);
                } else {
                    // Child belongs to other parents too — just detach from this one.
                    CategoryRelation::where('category_id', $category->id)
                        ->where('sub_category_id', $child->id)
                        ->delete();
                }
            }

            // Then delete the parent category itself.
            $this->deleteCategory($category);
        });

        return to_route('admin.categories.index')
            ->with('success', __('Category deleted successfully.'));
    }

    /* ------------------------------------------------------------------ */
    /* Private helpers                                                      */
    /* ------------------------------------------------------------------ */

    /**
     * Fully delete a single category:
     *  1. Null out products.category_id (avoids FK constraint violation).
     *  2. Detach all pivot rows via the model relations.
     *  3. Hard-delete the category row.
     *
     * Note: if you have run the `fix_products_category_fk` migration,
     * step 1 is handled automatically by MySQL's nullOnDelete cascade
     * and the products()->update() call becomes a no-op safety net.
     */
    private function deleteCategory(Category $category): void
    {
        // Null out any products still pointing at this category.
        // If the FK is already nullOnDelete (after migration), MySQL does
        // this automatically — this line is a safe double-guard.
        $category->products()->update(['category_id' => null]);

        // Detach all parent/child pivot rows.
        // If category_relations uses cascadeOnDelete (after migration),
        // MySQL handles this automatically — these are safe double-guards.
        $category->parents()->detach();
        $category->children()->detach();

        $category->delete();
    }

    /**
     * Map eager-loaded models to the frontend shape.
     * No extra queries fired — all relations already loaded.
     *
     * @param \Illuminate\Database\Eloquent\Collection<int, Category> $categories
     */
    private function formatTree(\Illuminate\Database\Eloquent\Collection $categories): array
    {
        return $categories->map(fn (Category $category) => [
            'id'       => $category->id,
            'title'    => $category->title,
            'slug'     => $category->slug,
            'status'   => $category->status?->value,
            'children' => $category->children->map(fn (Category $child) => [
                'id'         => $child->id,
                'title'      => $child->title,
                'slug'       => $child->slug,
                'parent_ids' => $child->parents->pluck('id')->values()->all(),
            ])->values()->all(),
        ])->values()->all();
    }
}