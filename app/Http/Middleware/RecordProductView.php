<?php

namespace App\Http\Middleware;

use App\Models\ProductView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecordProductView
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->getStatusCode() !== 200 || ! $request->routeIs('products.details')) {
            return $response;
        }

        $id = (int) $request->route('id', 0);

        if ($id <= 0) {
            return $response;
        }

        ProductView::query()->create([
            'product_id' => $id,
            'user_id' => $request->user()?->id,
            'session_id' => $request->session()->getId(),
        ]);

        return $response;
    }
}
