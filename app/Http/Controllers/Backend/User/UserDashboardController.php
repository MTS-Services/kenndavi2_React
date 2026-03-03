<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/User/UserHome');
    }

    public function profiles(): Response
    {
        return Inertia::render('backend/User/Profiles');
    }

    public function review(): Response
    {
        return Inertia::render('backend/User/review');
    }

    public function Editprofile(): Response
    {
        return Inertia::render('backend/User/Editprofile');
    }

    public function Editaddress(): Response
    {
        return Inertia::render('backend/User/Editaddress');
    }
    public function settingx(): Response
    {
        return Inertia::render('backend/User/settingx');
    }
}
