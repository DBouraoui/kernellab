<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class GuestController extends Controller
{
    public function home() {
        return Inertia::render('home/index');
    }

    public function blog() {
        return Inertia::render('blog/index');
    }
}
