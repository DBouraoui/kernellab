<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Newsletter;
use App\Models\Post;
use App\Models\Project;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'posts' => Post::count(),
                'projects' => Project::count(),
                'newsletter' => Newsletter::count(),
                'contacts' => Contact::count(),
            ],
            'latestContacts' => Contact::latest()->take(5)->get(),
        ]);
    }
}
