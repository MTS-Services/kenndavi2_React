<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/home');
    }

    public function men(): Response
    {
        return Inertia::render('frontend/men');
    }

    public function women(): Response
    {
        return Inertia::render('frontend/women');
    }

    public function accessories(): Response
    {
        return Inertia::render('frontend/accessories');
    }

    public function productdetails(): Response
    {
        return Inertia::render('frontend/productdetails');
    }

    public function aisuggestion(): Response
    {
        return Inertia::render('frontend/aisuggestion');
    }

    public function homeWomen(): Response
    {
        return Inertia::render('frontend/home-women');
    }

    public function cartpage(): Response
    {
        return Inertia::render('frontend/cartpage');
    }

    public function userlogin(): Response
    {
        return Inertia::render('frontend/User/userlogin');
    }

    public function entercode(): Response
    {
        return Inertia::render('frontend/User/entercode');
    }

    public function productdetails2(): Response
    {
        return Inertia::render('frontend/productdetails2');
    }

    public function orderconfirmed(): Response
    {
        return Inertia::render('frontend/orderconfirmed');
    }

    // In your Controller
    public function storeEmail(Request $request): \Illuminate\Http\RedirectResponse
    {
        // ... validation and sending code ...

        // Do NOT return a view() or a raw redirect to an external URL.
        // Use the standard redirect to a route that returns Inertia::render().
        return redirect()->route('otp.verify');
    }

    public function hoodiesWomen(): Response
    {
        return Inertia::render('frontend/hoodies-women');
    }

    public function sweatsuitsMen(): Response
    {
        return Inertia::render('frontend/sweatsuitsmen');
    }
}
