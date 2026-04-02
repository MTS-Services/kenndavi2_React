<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DiscountType;
use App\Enums\ProductStatus;
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
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    private const PER_PAGE = 12;

    /* ─────────────────────────────────────────────────────────────
     | INDEX
     | ─────────────────────────────────────────────────────────────*/

    public function index(Request $request): Response
    {
        $type = ProductType::tryFrom($request->query('type', ProductType::MEN->value))
            ?? ProductType::MEN;

        $paginator = Product::with([
            'images' => fn($q) => $q->where('is_primary', true),
        ])
            ->where('type', $type->value)
            ->latest()
            ->paginate(self::PER_PAGE, ['*'], 'page', $request->query('page', 1));

        $products = $paginator->through(fn(Product $p) => [
            'id'                => $p->id,
            'title'             => $p->title,
            'slug'              => $p->slug,
            'description'       => $p->description,
            'price'             => (string) $p->price,
            'status'            => $p->status->value,
            'type'              => $p->type->value,
            'primary_image_url' => $p->images->first()?->url,
        ]);

        return Inertia::render('backend/Admin/product/index', [
            'products'     => $products,
            'activeType'   => $type->value,
            'productTypes' => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | CHECK SLUG (AJAX)
     | ─────────────────────────────────────────────────────────────*/

    public function checkSlug(Request $request): JsonResponse
    {
        $slug      = strtolower(trim($request->query('slug', '')));
        $excludeId = $request->query('exclude_id');

        if (! $slug) {
            return response()->json(['available' => false, 'reason' => 'empty']);
        }

        if (! preg_match('/^[a-z0-9_-]+$/', $slug)) {
            return response()->json(['available' => false, 'reason' => 'invalid']);
        }

        $exists = Product::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', (int) $excludeId))
            ->exists();

        return response()->json(['available' => ! $exists]);
    }

    /* ─────────────────────────────────────────────────────────────
     | CREATE
     | ─────────────────────────────────────────────────────────────*/

    public function create(Request $request): Response
    {
        $type = ProductType::tryFrom($request->query('type', ProductType::MEN->value))
            ?? ProductType::MEN;

        return Inertia::render('backend/Admin/product/product-from', [
            'initialType'     => $type->value,
            'categories'      => $this->categoriesForSelect($type),
            'discountTypes'   => DiscountType::options(),
            'productTypes'    => ProductType::options(),
            'productStatuses' => ProductStatus::options(),
            'availableTags'   => $this->tagsForSelect(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | STORE
     |
     | The frontend sends category_id and subcategory_id as two
     | completely separate fields. We write them as-is — no merging,
     | no replacing, no guessing. Each column stores exactly what
     | the user selected.
     | ─────────────────────────────────────────────────────────────*/

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $product = Product::create([
                'title'              => $request->title,
                'slug'               => $request->slug,
                'description'        => $request->description,
                'type'               => $request->type,
                'price'              => $request->price,
                'discount'           => $request->discount ?: null,
                'discount_type'      => $request->discount_type ?: null,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at'   => $request->discount_ends_at   ?: null,
                // ── Write both columns directly from the request ──
                'category_id'        => $request->filled('category_id')    ? (int) $request->category_id    : null,
                'subcategory_id'     => $request->filled('subcategory_id') ? (int) $request->subcategory_id : null,
                'status'             => $request->input('status', ProductStatus::ACTIVE->value),
                'is_featured'        => $request->boolean('is_featured', false),
                'is_new'             => $request->boolean('is_new', false),
                'created_by'         => auth('admin')->id(),
                'updated_by'         => auth('admin')->id(),
            ]);

            $product->tags()->sync($request->input('tag_ids', []));
            $this->syncImages($product, $request, isPrimarySlot: true);
            $this->syncVariants($product, $request->input('variants', []), removedIds: []);
        });

        return redirect()
            ->route('admin.products.index', ['type' => $request->type])
            ->with('success', 'Product created successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | SHOW
     | ─────────────────────────────────────────────────────────────*/

    public function show(Product $product, Request $request): Response
    {
        $product->load([
            'images'           => fn($q) => $q->orderBy('sort_order'),
            'tags:id,name',
            'category:id,title',
            'subcategory:id,title',
            'variants.color:id,name,hex',
            'variants.size:id,name',
        ]);

        $productData = [
            'id'                 => $product->id,
            'title'              => $product->title,
            'slug'               => $product->slug,
            'description'        => $product->description,
            'price'              => (string) $product->price,
            'discount'           => $product->discount ? (string) $product->discount : null,
            'discount_type'      => $product->discount_type?->value,
            'discount_starts_at' => $product->discount_starts_at?->toDateTimeString(),
            'discount_ends_at'   => $product->discount_ends_at?->toDateTimeString(),
            'type'               => $product->type->value,
            'status'             => $product->status->value,
            'is_featured'        => (bool) $product->is_featured,
            'is_new'             => (bool) $product->is_new,
            // Both relations loaded independently — no ambiguity
            'category'           => $product->category
                ? ['id' => $product->category->id, 'title' => $product->category->title]
                : null,
            'subcategory'        => $product->subcategory
                ? ['id' => $product->subcategory->id, 'title' => $product->subcategory->title]
                : null,
            'images'             => $product->images->map(fn($img) => [
                'id'         => $img->id,
                'url'        => $img->url,
                'alt_text'   => $img->alt_text,
                'is_primary' => (bool) $img->is_primary,
                'sort_order' => $img->sort_order,
            ])->values()->toArray(),
            'variants'           => $product->variants->map(fn($v) => [
                'id'       => $v->id,
                'quantity' => (int) $v->quantity,
                'status'   => $v->status?->value,
                'color'    => $v->color ? ['id' => $v->color->id, 'name' => $v->color->name, 'hex' => $v->color->hex] : null,
                'size'     => $v->size  ? ['id' => $v->size->id,  'name' => $v->size->name]  : null,
            ])->values()->toArray(),
            'tags'               => $product->tags->map(fn($t) => [
                'id'   => $t->id,
                'name' => $t->name,
            ])->values()->toArray(),
            'created_at'         => $product->created_at->toDateTimeString(),
            'updated_at'         => $product->updated_at->toDateTimeString(),
        ];

        return Inertia::render('backend/Admin/product/details', [
            'product'    => $productData,
            'activeType' => $request->query('type', $product->type->value),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | EDIT
     |
     | Read category_id and subcategory_id directly from the product
     | columns. No parent-walking, no guessing.
     | ─────────────────────────────────────────────────────────────*/

    public function edit(Product $product): Response
    {
        $product->load([
            'images',
            'tags:id,name',
            'variants.color:id,name,hex',
            'variants.size:id,name',
        ]);

        $productData = [
            'id'                      => $product->id,
            'title'                   => $product->title,
            'slug'                    => $product->slug,
            'description'             => $product->description,
            'price'                   => (string) $product->price,
            'discount'                => $product->discount ? (string) $product->discount : '',
            'discount_type'           => $product->discount_type?->value ?? '',
            'discount_starts_at'      => $product->discount_starts_at?->toDateTimeString(),
            'discount_ends_at'        => $product->discount_ends_at?->toDateTimeString(),
            'type'                    => $product->type->value,
            'status'                  => $product->status->value,
            'is_featured'             => (bool) $product->is_featured,
            'is_new'                  => (bool) $product->is_new,
            // ── Read both columns directly — no helper needed ──
            'resolved_category_id'    => $product->category_id,
            'resolved_subcategory_id' => $product->subcategory_id,
            'tag_ids'                 => $product->tags->pluck('id')->values()->all(),
            'images'                  => $product->images->map(fn($img) => [
                'id'         => $img->id,
                'url'        => $img->url,
                'alt_text'   => $img->alt_text,
                'is_primary' => (bool) $img->is_primary,
                'sort_order' => $img->sort_order,
                'color_id'   => $img->color_id,
            ])->values()->toArray(),
            'variants'                => $product->variants->map(fn($v) => [
                'id'       => $v->id,
                'color_id' => $v->color_id,
                'size_id'  => $v->size_id,
                'quantity' => (int) $v->quantity,
                'status'   => $v->status?->value,
                'color'    => $v->color ? ['id' => $v->color->id, 'name' => $v->color->name, 'hex' => $v->color->hex] : null,
                'size'     => $v->size  ? ['id' => $v->size->id,  'name' => $v->size->name]  : null,
            ])->values()->toArray(),
        ];

        return Inertia::render('backend/Admin/product/product-from', [
            'product'         => $productData,
            'categories'      => $this->categoriesForSelect($product->type),
            'discountTypes'   => DiscountType::options(),
            'productTypes'    => ProductType::options(),
            'productStatuses' => ProductStatus::options(),
            'availableTags'   => $this->tagsForSelect(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | UPDATE
     |
     | Same principle as store — write both columns as-is from
     | the request. No merging or overwriting.
     | ─────────────────────────────────────────────────────────────*/

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $product->update([
                'title'              => $request->title,
                'slug'               => $request->slug,
                'description'        => $request->description,
                'type'               => $request->type,
                'price'              => $request->price,
                'discount'           => $request->discount ?: null,
                'discount_type'      => $request->discount_type ?: null,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at'   => $request->discount_ends_at   ?: null,
                // ── Write both columns directly from the request ──
                'category_id'        => $request->filled('category_id')    ? (int) $request->category_id    : null,
                'subcategory_id'     => $request->filled('subcategory_id') ? (int) $request->subcategory_id : null,
                'status'             => $request->input('status', $product->status->value),
                'is_featured'        => $request->boolean('is_featured', false),
                'is_new'             => $request->boolean('is_new', false),
                'updated_by'         => auth('admin')->id(),
            ]);

            $product->tags()->sync($request->input('tag_ids', []));
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
            $product->tags()->detach();
            $product->delete();
        });

        return redirect()
            ->route('admin.products.index', [
                'type' => $request->input('type', 'men'),
                'page' => $request->input('page', 1),
            ])
            ->with('success', 'Product deleted successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | PRIVATE HELPERS
     |
     | NOTE: resolveCategoryIdFromRequest() and resolveCategory()
     | have been intentionally removed. They were the source of the
     | category/subcategory mix-up. Both columns are now written and
     | read directly — no intermediate resolution needed.
     | ─────────────────────────────────────────────────────────────*/

    private function syncVariants(Product $product, array $variants, array $removedIds): void
    {
        if (! empty($removedIds)) {
            ProductVariant::whereIn('id', $removedIds)
                ->where('product_id', $product->id)
                ->delete();
        }

        foreach ($variants as $row) {
            $existingId = isset($row['existingId']) ? (int) $row['existingId'] : null;
            $quantity   = (int) ($row['quantity'] ?? 0);

            if ($existingId) {
                ProductVariant::where('id', $existingId)
                    ->where('product_id', $product->id)
                    ->update(['quantity' => $quantity]);
            } else {
                $color = Color::firstOrCreateByHex($row['color']);
                $size  = Size::firstOrCreateByName($row['size']);
                ProductVariant::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'color_id'   => $color->id,
                        'size_id'    => $size->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'status'   => 'active',
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
                'url'        => Storage::url($url),
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        foreach ((array) $request->file('new_images', []) as $i => $file) {
            if (! $file) continue;
            $url = $file->store('products', 'public');
            $product->images()->create([
                'url'        => Storage::url($url),
                'is_primary' => false,
                'sort_order' => $sortOffset + $i + 1,
            ]);
        }
    }

    private function removeImages(array $ids): void
    {
        if (empty($ids)) return;
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

    private function categoriesForSelect(ProductType $type): \Illuminate\Database\Eloquent\Collection
    {
        return Category::whereDoesntHave('parents')
            ->forType($type)
            ->with([
                'children' => fn ($q) => $q->forType($type)->select(['categories.id', 'categories.title']),
            ])
            ->get(['id', 'title']);
    }

    private function tagsForSelect(): \Illuminate\Support\Collection
    {
        return Tag::orderBy('name')->get(['id', 'name']);
    }
}
