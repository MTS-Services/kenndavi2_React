<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Banner;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $typeValue = $request->query('type', ProductType::MEN->value);

        // Fallback to MEN if an unrecognised type is passed
        $type = ProductType::tryFrom($typeValue) ?? ProductType::MEN;

        $products = Product::query()
            ->with('primaryImage')
            ->forType($type)
            ->featured()
            ->inRandomOrder()
            ->take(4)
            ->get();

        $banner = Banner::query()
            ->with('images')
            ->where('type', $type->value)
            ->first();

        $bannerSlides = $banner?->images
            ->sortBy('id')
            ->values()
            ->map(fn ($image): array => [
                'id' => $image->id,
                'title' => $banner->content ?? '',
                'primaryCta' => $banner->action_title ?: 'Shop Now',
                'actionUrl' => $banner->action_url ?: '/sweatsuitsmen',
                'image' => $image->url,
            ])?->all() ?? [];

        $announcement = Announcement::query()
            ->where('is_active', true)
            ->first();

        return Inertia::render('frontend/home', [
            'products' => $products,
            'bannerSlides' => $bannerSlides,
            'announcement' => $announcement?->announcement,
        ]);
    }
}
