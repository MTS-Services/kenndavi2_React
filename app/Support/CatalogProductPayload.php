<?php

namespace App\Support;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Collection;

final class CatalogProductPayload
{
    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     slug: string|null,
     *     price: float,
     *     discount: float,
     *     discount_type: string,
     *     images: list<array{url: string|null, alt: string}>
     * }
     */
    public static function from(Product $p): array
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'price' => (float) $p->price,
            'discount' => (float) ($p->discount ?? 0),
            'discount_type' => $p->discount_type?->value ?? 'percentage',
            'images' => self::normalizeImages($p),
        ];
    }

    /**
     * @return list<array{url: string|null, alt: string}>
     */
    private static function normalizeImages(Product $p): array
    {
        /** @var Collection<int, ProductImage> $imgs */
        $imgs = $p->relationLoaded('images')
            ? $p->images
            : $p->images()->orderByDesc('is_primary')->orderBy('sort_order')->get();

        $list = $imgs->take(4)->map(fn ($img) => [
            'url' => $img->url,
            'alt' => $img->alt_text ?? $p->title,
        ])->values()->toArray();

        $fallback = $list[0] ?? ['url' => null, 'alt' => $p->title];
        while (count($list) < 4) {
            $list[] = $fallback;
        }

        return $list;
    }
}
