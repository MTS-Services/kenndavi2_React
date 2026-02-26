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
}
