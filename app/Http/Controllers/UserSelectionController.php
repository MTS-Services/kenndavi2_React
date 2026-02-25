<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserSelectionController extends Controller
{
    /**
     * Get a list of all users for admin selection panel
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request)
    {
        // Check if user is admin
        if (! $request->user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get all users
        $users = User::select('name', 'email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];
            });

        return response()->json([
            'users' => $users,
        ]);
    }

   
}
