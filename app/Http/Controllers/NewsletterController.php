<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{

    public function index()
    {
        return Inertia::render('newsletter/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ],[
            'email.unique' => 'Une erreur est survenue lors de l\'enregistrement'
        ]);

        Newsletter::create([
            'email' => $request->email,
            'active' => true
        ]);

        return back()->with('success', 'Bienvenue dans le club ! 🚀');
    }
}
