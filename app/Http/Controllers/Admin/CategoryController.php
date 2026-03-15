<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/Admin/category');
    }

    public function store(Request $request)
    {
        // create data of category via inertia response with success message
    }

    public function edit($id)
    {
        // return data of category by id via inertia response
    }

    public function update(Request $request, $id)
    {
        // update data of category by id via inertia response with success message
    }

    public function destroy($id)
    {
        // delete data of category by id via inertia response with success message
    }
}
