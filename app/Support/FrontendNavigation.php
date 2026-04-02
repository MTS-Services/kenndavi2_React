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
                    'children' => fn ($q) => $q
                        ->forType($case)
                        ->select(['categories.id', 'categories.title'])
                        ->orderByPivot('sort_order'),
                ])
                ->orderBy('sort_order')
                ->get(['id', 'title']);

            $categories = $topLevel->map(fn (Category $parent) => [
                'id' => (int) $parent->id,
                'title' => $parent->title,
                'children' => $parent->children->map(fn (Category $child) => [
                    'id' => (int) $child->id,
                    'title' => $child->title,
                ])->values()->all(),
            ])->values()->all();

            $byType[$case->value] = [
                'landingHref' => match ($case) {
                    ProductType::MEN => route('men'),
                    ProductType::WOMEN => route('women'),
                    ProductType::ACCESSORIES => route('accessories'),
                },
                'listingHref' => match ($case) {
                    ProductType::MEN => route('sweatsuitsmen'),
                    ProductType::WOMEN => route('hoodies.women'),
                    ProductType::ACCESSORIES => route('accessories.catalog'),
                },
                'categories' => $categories,
            ];
        }

        return [
            'productTypes' => ProductType::options(),
            'byType' => $byType,
        ];
    }
}
