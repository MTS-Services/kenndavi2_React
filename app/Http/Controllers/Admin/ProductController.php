<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DiscountType;
use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Size;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /* ─────────────────────────────────────────────────────────────
     | INDEX
     | ─────────────────────────────────────────────────────────────*/

    public function index(Request $request): Response
    {
        $type = ProductType::tryFrom($request->query('type', ProductType::MEN->value))
            ?? ProductType::MEN;

        $products = Product::with([
            'images' => fn ($q) => $q->where('is_primary', true),
        ])
            ->where('type', $type->value)
            ->latest()
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'description' => $p->description,
                'price' => $p->price,
                'status' => $p->status,
                'type' => $p->type,
                'primary_image_url' => $p->images->first()?->url,
            ]);

        return Inertia::render('backend/Admin/product/index', [
            'products' => $products,
            'activeType' => $type->value,
            'productTypes' => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | CREATE
     | ─────────────────────────────────────────────────────────────*/

    public function create(Request $request): Response
    {
        $type = ProductType::tryFrom($request->query('type', ProductType::MEN->value))
            ?? ProductType::MEN;

        return Inertia::render('backend/Admin/product/product-from', [
            'initialType' => $type->value,
            'categories' => $this->categoriesForSelect(),
            'discountTypes' => DiscountType::options(),
            'productTypes' => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | STORE
     | ─────────────────────────────────────────────────────────────*/

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {

            $categoryId = $this->resolveCategoryIdFromRequest($request);

            $product = Product::create([
                'title' => $request->title,
                'slug' => $request->slug,   // ← user-provided, validated
                'description' => $request->description,
                'type' => $request->type,
                'price' => $request->price,
                'discount' => $request->discount,
                'discount_type' => $request->discount_type ?: null,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at' => $request->discount_ends_at ?: null,
                'category_id' => $categoryId,
                'created_by' => auth('admin')->id(),
                'updated_by' => auth('admin')->id(),
            ]);

            $this->syncImages($product, $request, isPrimarySlot: true);
            $this->syncVariants($product, $request->input('variants', []), removedIds: []);
        });

        return redirect()
            ->route('admin.products.index', ['type' => $request->type])
            ->with('success', 'Product created successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | EDIT
     | ─────────────────────────────────────────────────────────────*/

    public function edit(Product $product): Response
    {
        $product->load([
            'images',
            'variants.color:id,name,hex',
            'variants.size:id,name',
        ]);

        [$categoryId, $subcategoryId] = $this->resolveCategory($product);

        return Inertia::render('backend/Admin/product/product-from', [
            'product' => array_merge($product->toArray(), [
                'resolved_category_id' => $categoryId,
                'resolved_subcategory_id' => $subcategoryId,
            ]),
            'categories' => $this->categoriesForSelect(),
            'discountTypes' => DiscountType::options(),
            'productTypes' => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | UPDATE
     | ─────────────────────────────────────────────────────────────*/

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {

            $categoryId = $this->resolveCategoryIdFromRequest($request);

            $product->update([
                'title' => $request->title,
                'slug' => $request->slug,   // ← user-provided, validated (unique ignores self)
                'description' => $request->description,
                'type' => $request->type,
                'price' => $request->price,
                'discount' => $request->discount,
                'discount_type' => $request->discount_type ?: null,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at' => $request->discount_ends_at ?: null,
                'category_id' => $categoryId,
                'updated_by' => auth('admin')->id(),
            ]);

            $this->removeImages($request->input('removed_image_ids', []));
            $this->syncImages($product, $request, isPrimarySlot: false);
            $this->syncVariants(
                $product,
                $request->input('variants', []),
                $request->input('removed_variant_ids', [])
            );
        });

        return redirect()
            ->route('admin.products.index', ['type' => $request->type])
            ->with('success', 'Product updated successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | DESTROY
     | ─────────────────────────────────────────────────────────────*/

    public function destroy(Product $product, Request $request): RedirectResponse
    {
        DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                $this->deleteImageFile($image);
            }
            $product->delete();
        });

        return redirect()
            ->route('admin.products.index', ['type' => $request->query('type', 'men')])
            ->with('success', 'Product deleted successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | PRIVATE HELPERS
     | ─────────────────────────────────────────────────────────────*/

    /**
     * Resolve the final category_id to store on the product.
     * If a subcategory is selected, we store the subcategory id
     * (the Category model's parents/children relations handle nesting).
     */
    private function resolveCategoryIdFromRequest(Request $request): ?int
    {
        if ($request->filled('subcategory_id')) {
            return (int) $request->subcategory_id;
        }

        return $request->filled('category_id') ? (int) $request->category_id : null;
    }

    /**
     * Sync variant matrix rows.
     *
     * @param  array<int, array{size: string, color: string, quantity: int, existingId?: int}>  $variants
     * @param  array<int, int>  $removedIds
     */
    private function syncVariants(Product $product, array $variants, array $removedIds): void
    {
        if (! empty($removedIds)) {
            ProductVariant::whereIn('id', $removedIds)
                ->where('product_id', $product->id)
                ->delete();
        }

        foreach ($variants as $row) {
            $existingId = isset($row['existingId']) ? (int) $row['existingId'] : null;
            $quantity = (int) ($row['quantity'] ?? 0);

            if ($existingId) {
                ProductVariant::where('id', $existingId)
                    ->where('product_id', $product->id)
                    ->update(['quantity' => $quantity]);
            } else {
                $color = Color::firstOrCreateByHex($row['color']);
                $size = Size::firstOrCreateByName($row['size']);

                ProductVariant::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'color_id' => $color->id,
                        'size_id' => $size->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'status' => 'active',
                    ]
                );
            }
        }
    }

    private function syncImages(Product $product, Request $request, bool $isPrimarySlot): void
    {
        $sortOffset = $product->images()->max('sort_order') ?? 0;

        if ($request->hasFile('primary_image')) {
            $url = $request->file('primary_image')->store('products', 'public');

            if (! $isPrimarySlot) {
                $old = $product->images()->where('is_primary', true)->first();
                if ($old) {
                    $this->deleteImageFile($old);
                    $old->delete();
                }
            }

            $product->images()->create([
                'url' => Storage::url($url),
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        foreach ((array) $request->file('new_images', []) as $i => $file) {
            if (! $file) {
                continue;
            }
            $url = $file->store('products', 'public');
            $product->images()->create([
                'url' => Storage::url($url),
                'is_primary' => false,
                'sort_order' => $sortOffset + $i + 1,
            ]);
        }
    }

    private function removeImages(array $ids): void
    {
        if (empty($ids)) {
            return;
        }
        ProductImage::whereIn('id', $ids)->each(function (ProductImage $image) {
            $this->deleteImageFile($image);
            $image->delete();
        });
    }

    private function deleteImageFile(ProductImage $image): void
    {
        $path = str_replace('/storage/', '', parse_url($image->url, PHP_URL_PATH));
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * @return array{int|null, int|null} [$categoryId, $subcategoryId]
     */
    private function resolveCategory(Product $product): array
    {
        if (! $product->category_id) {
            return [null, null];
        }

        $category = Category::with('parents:id')->find($product->category_id);

        if ($category?->parents->isNotEmpty()) {
            return [$category->parents->first()->id, $product->category_id];
        }

        return [$product->category_id, null];
    }

    private function categoriesForSelect()
    {
        return Category::whereDoesntHave('parents')
            ->with('children:id,title')
            ->get(['id', 'title']);
    }
}
