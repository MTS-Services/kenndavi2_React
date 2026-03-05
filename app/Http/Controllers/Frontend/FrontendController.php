<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
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

    public function hoodiesWomen(): Response
    {
        return Inertia::render('frontend/hoodies-women');
    }

    public function sweatsuitsMen(): Response
    {
        return Inertia::render('frontend/sweatsuitsmen');
    }

    public function orders(): Response 
    {
        return Inertia::render('frontend/User/orders');
    }

    public function orders2(): Response 
    {
        return Inertia::render('frontend/User/orders2');
    }

    public function shippings(): Response 
    {
        return Inertia::render('frontend/shippings');
    }

    public function privacyPolicy(): Response 
    {
        return Inertia::render('frontend/privacy-policy');
    }

    public function termsAndConditions(): Response 
    {
        return Inertia::render('frontend/terms-and-conditions');
    }

    
}
