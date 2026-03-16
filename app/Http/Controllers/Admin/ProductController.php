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
use Illuminate\Support\Str;
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
            'images' => fn($q) => $q->where('is_primary', true),
        ])
            ->where('type', $type->value)
            ->latest()
            ->get()
            ->map(fn(Product $p) => [
                'id'                => $p->id,
                'title'             => $p->title,
                'description'       => $p->description,
                'price'             => $p->price,
                'status'            => $p->status,
                'type'              => $p->type,
                'primary_image_url' => $p->images->first()?->url,
            ]);

        return Inertia::render('backend/Admin/product/index', [
            'products'     => $products,
            'activeType'   => $type->value,
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
            'initialType'   => $type->value,
            'categories'    => $this->categoriesForSelect(),
            'discountTypes' => DiscountType::options(),
            'productTypes'  => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | STORE
     | ─────────────────────────────────────────────────────────────*/

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {

            /* 1 ── Resolve category_id
             *      Use subcategory if chosen, otherwise top-level category */
            $categoryId = $request->filled('subcategory_id')
                ? (int) $request->subcategory_id
                : ($request->filled('category_id') ? (int) $request->category_id : null);

            /* 2 ── Create the product */
            $product = Product::create([
                'title'              => $request->title,
                'slug'               => Str::slug($request->title) . '-' . uniqid(),
                'description'        => $request->description,
                'type'               => $request->type,
                'price'              => $request->price,
                'discount'           => $request->discount,
                'discount_type'      => $request->discount_type,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at'   => $request->discount_ends_at   ?: null,
                'category_id'        => $categoryId,
                'created_by'         => request()->user()->id,
                'updated_by'         => request()->user()->id,
            ]);

            /* 3 ── Images */
            $this->syncImages($product, $request, isPrimary: true);

            /* 4 ── Variant matrix */
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
            'product'       => array_merge($product->toArray(), [
                'resolved_category_id'    => $categoryId,
                'resolved_subcategory_id' => $subcategoryId,
            ]),
            'categories'    => $this->categoriesForSelect(),
            'discountTypes' => DiscountType::options(),
            'productTypes'  => ProductType::options(),
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     | UPDATE
     | ─────────────────────────────────────────────────────────────*/

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {

            /* 1 ── Resolve category */
            $categoryId = $request->filled('subcategory_id')
                ? (int) $request->subcategory_id
                : ($request->filled('category_id') ? (int) $request->category_id : null);

            /* 2 ── Update core fields */
            $product->update([
                'title'              => $request->title,
                'description'        => $request->description,
                'type'               => $request->type,
                'price'              => $request->price,
                'discount'           => $request->discount,
                'discount_type'      => $request->discount_type ?: null,
                'discount_starts_at' => $request->discount_starts_at ?: null,
                'discount_ends_at'   => $request->discount_ends_at   ?: null,
                'category_id'        => $categoryId,
                'updated_by'         => request()->user()->id,
            ]);

            /* 3 ── Images */
            $this->removeImages($request->input('removed_image_ids', []));
            $this->syncImages($product, $request, isPrimary: false);

            /* 4 ── Variant matrix */
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
            // Delete stored image files
            foreach ($product->images as $image) {
                $this->deleteImageFile($image);
            }
            $product->delete(); // cascades to variants & images via DB constraints
        });

        return redirect()
            ->route('admin.products.index', ['type' => $request->query('type', 'men')])
            ->with('success', 'Product deleted successfully.');
    }

    /* ─────────────────────────────────────────────────────────────
     | PRIVATE HELPERS
     | ─────────────────────────────────────────────────────────────*/

    /**
     * Sync the variant matrix rows for a product.
     *
     * Strategy:
     *  • Deleted rows  → hard-delete by id (passed in $removedIds)
     *  • Existing rows → update quantity only (never recreate Color/Size)
     *  • New rows      → firstOrCreate Color & Size, then
     *                    updateOrCreate the ProductVariant record
     *
     * @param  array<int, array{size: string, color: string, quantity: int, existingId?: int}>  $variants
     * @param  array<int, int>  $removedIds
     */
    private function syncVariants(Product $product, array $variants, array $removedIds): void
    {
        /* Delete explicitly removed rows */
        if (! empty($removedIds)) {
            ProductVariant::whereIn('id', $removedIds)
                ->where('product_id', $product->id) // safety: only own variants
                ->delete();
        }

        foreach ($variants as $row) {
            $existingId = isset($row['existingId']) ? (int) $row['existingId'] : null;
            $quantity   = (int) ($row['quantity'] ?? 0);

            if ($existingId) {
                /* ── Update existing row — only touch quantity ── */
                ProductVariant::where('id', $existingId)
                    ->where('product_id', $product->id)
                    ->update(['quantity' => $quantity]);
            } else {
                /* ── New combination ── */
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

    /**
     * Store uploaded images.
     *
     * @param  bool  $isPrimary  On create we set is_primary=true for the
     *                           primary slot.  On update we leave existing
     *                           primary unchanged and only add new ones.
     */
    private function syncImages(Product $product, Request $request, bool $isPrimary): void
    {
        $sortOffset = $product->images()->max('sort_order') ?? 0;

        /* Primary image slot */
        if ($request->hasFile('primary_image')) {
            $url = $request->file('primary_image')
                ->store('products', 'public');

            // On update: remove old primary before inserting new one
            if (! $isPrimary) {
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

        /* Additional image slots */
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

    /**
     * Delete a set of product image records (and their stored files).
     *
     * @param  array<int>  $ids
     */
    private function removeImages(array $ids): void
    {
        if (empty($ids)) return;

        ProductImage::whereIn('id', $ids)->each(function (ProductImage $image) {
            $this->deleteImageFile($image);
            $image->delete();
        });
    }

    /** Delete the physical file behind a ProductImage row (if it exists). */
    private function deleteImageFile(ProductImage $image): void
    {
        // Convert public URL back to storage path
        $path = str_replace('/storage/', '', parse_url($image->url, PHP_URL_PATH));
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Resolve which category_id is the top-level and which is the subcategory
     * for a product that may be stored against either level.
     *
     * @return array{int|null, int|null}  [$categoryId, $subcategoryId]
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

    /**
     * Top-level categories with their children eager-loaded
     * (used by both create and edit views).
     */
    private function categoriesForSelect()
    {
        return Category::whereDoesntHave('parents')
            ->with('children:id,title')
            ->get(['id', 'title']);
    }
}
