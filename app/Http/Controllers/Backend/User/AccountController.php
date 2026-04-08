<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/user/profile');
    }

    public function edit(): Response
    {
        return Inertia::render('backend/user/profile-form');
    }

    public function update(): Response
    {
        return Inertia::render('backend/user/profile/profile-form');
    }

    public function settings(): Response
    {
        return Inertia::render('backend/user/settings');
    }

    public function updateSettings(): Response
    {
        return Inertia::render('backend/user/updateSettings');
    }

    public function address(): Response
    {
        return Inertia::render('backend/user/address-form');
    }

    public function updateAddress(): Response
    {
        return Inertia::render('backend/user/address-form');
    }
}
