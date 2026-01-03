<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function home() {

        $posts = Post::published()->latest()->take(4)->get();

        return Inertia::render('home/index', [
            'posts' => $posts
        ]);
    }
    public function contact() {
        return Inertia::render('contact/index');
    }

    public function about() {
        return Inertia::render('about/index');
    }
}
