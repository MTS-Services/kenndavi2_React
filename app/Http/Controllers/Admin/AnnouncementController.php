<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display the announcement edit page.
     */
    public function index(): Response
    {
        // Get the first announcement or create a dummy one if table is empty
        $announcement = Announcement::where('is_active', true)->first();
        if (!$announcement) {
            Inertia::render('backend/Admin/announcement');
        }
        return Inertia::render('backend/Admin/announcement', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Update the announcement.
     */
    public function publish(Request $request, $id)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
            'announcement' => 'required|string|min:5|max:1000',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update($validated);

        // This returns the user back to the same page with updated data
        return back()->with('success', 'Announcement published successfully.');
    }
}
