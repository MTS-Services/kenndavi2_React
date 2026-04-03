<?php

namespace App\Support;

use App\Enums\ProductType;
use App\Models\Category;

class FrontendNavigation
{
    /**
     * @return array{
     *     productTypes: array<int, array{value: string, label: string}>,
     *     byType: array<string, array{
     *         landingHref: string,
     *         listingHref: string,
     *         categories: array<int, array{
     *             id: int,
     *             title: string,
     *             children: array<int, array{id: int, title: string}>
     *         }>
     *     }>
     * }
     */
    public static function build(): array
    {
        $byType = [];
        

        foreach (ProductType::cases() as $case) {
            $topLevel = Category::query()
                ->whereDoesntHave('parents')
                ->forType($case)
                ->with([
                    'children' => fn($q) => $q
                        ->forType($case)
                        ->select(['categories.id', 'categories.title', 'categories.slug'])
                        ->orderByPivot('sort_order'),
                ])
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug']);

            $categories = $topLevel->map(fn(Category $parent) => [
                'id' => (int) $parent->id,
                'slug' => (string) $parent->slug,
                'title' => $parent->title,
                'children' => $parent->children->map(fn(Category $child) => [
                    'id' => (int) $child->id,
                    'slug' => (string) $child->slug,
                    'title' => $child->title,
                ])->values()->all(),
            ])->values()->all();

            $href = route('home', ['type' => $case->value]); // generates /?type=men

            $byType[$case->value] = [
                'landingHref' => $href,
                'listingHref' => route('products.category', ['type' => $case->value]),
                'categories' => $categories,
            ];
        }

        return [
            'productTypes' => ProductType::options(),
            'byType' => $byType,
        ];
    }
}
