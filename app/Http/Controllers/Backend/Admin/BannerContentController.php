<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\BannerImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerContentController extends Controller
{
    public function index(Request $request): Response
    {
        $type = ProductType::tryFrom($request->query('type', ProductType::MEN->value))
            ?? ProductType::MEN;

        $banner = Banner::query()
            ->with('images')
            ->where('type', $type->value)
            ->first();

        return Inertia::render('backend/Admin/banner-content', [
            'activeType' => $type->value,
            'productTypes' => ProductType::options(),
            'banner' => $banner
                ? [
                    'id' => $banner->id,
                    'type' => $banner->type->value,
                    'content' => $banner->content,
                    'action_title' => $banner->action_title,
                    'action_url' => $banner->action_url,
                    'images' => $banner->images
                        ->sortBy('id')
                        ->values()
                        ->map(fn (BannerImage $image): array => [
                            'id' => $image->id,
                            'url' => $image->url,
                            'path' => $image->url,
                            'mime_type' => $this->resolveMimeType($image->url),
                            'name' => $image->alt_text,
                        ]),
                ]
                : null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:'.implode(',', array_column(ProductType::options(), 'value'))],
            'content' => ['nullable', 'string', 'max:5000'],
            'action_title' => ['nullable', 'string', 'max:100'],
            'action_url' => ['nullable', 'url', 'max:255'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:10240'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer', 'exists:banner_images,id'],
        ]);

        DB::transaction(function () use ($validated, $request): void {
            $banner = Banner::query()->firstOrCreate(
                ['type' => $validated['type']],
                ['type' => $validated['type']]
            );

            $banner->update([
                'content' => $validated['content'] ?? null,
                'action_title' => $validated['action_title'] ?? null,
                'action_url' => $validated['action_url'] ?? null,
            ]);

            $removeIds = collect($validated['remove_image_ids'] ?? [])
                ->map(fn ($id): int => (int) $id)
                ->all();

            if ($removeIds !== []) {
                BannerImage::query()
                    ->where('banner_id', $banner->id)
                    ->whereIn('id', $removeIds)
                    ->get()
                    ->each(function (BannerImage $image): void {
                        $this->deleteImageFile($image->url);
                        $image->delete();
                    });
            }

            foreach ((array) $request->file('images', []) as $file) {
                if ($file === null) {
                    continue;
                }

                $storedPath = $file->store('banners', 'public');

                $banner->images()->create([
                    'url' => Storage::url($storedPath),
                    'alt_text' => $banner->action_title,
                ]);
            }
        });

        return redirect()
            ->route('admin.banner-content.index', ['type' => $validated['type']])
            ->with('success', 'Banner content updated successfully.');
    }

    private function deleteImageFile(string $url): void
    {
        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH) ?? '');

        if ($path !== '' && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    private function resolveMimeType(string $url): string
    {
        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH) ?? '');

        if ($path !== '' && Storage::disk('public')->exists($path)) {
            $mime = Storage::disk('public')->mimeType($path);

            if (is_string($mime) && $mime !== '') {
                return $mime;
            }
        }

        return 'image/jpeg';
    }
}
