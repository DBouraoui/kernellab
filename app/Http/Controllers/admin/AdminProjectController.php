<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::all();

        return Inertia::render('admin/project/index', compact('projects'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/project/create-project');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validation stricte
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:devops,cloud,web,mobile,opensource,saas',
            'status' => 'required|in:draft,published,archived',
            'description_short' => 'nullable|string|max:500',
            'content' => 'nullable|string', // Le Markdown
            'stack' => 'nullable|string', // On reçoit "React, Laravel, AWS"
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072', // Max 3MB
            'is_featured' => 'boolean',
        ]);

        // 2. Gestion de l'upload d'image
        if ($request->hasFile('thumbnail')) {
            // Stocke dans storage/app/public/projects
            $path = $request->file('thumbnail')->store('projects', 'public');
            $validated['thumbnail_url'] = '/storage/' . $path;
        }

        // 3. Transformation de la Stack (String -> Array)
        if (!empty($validated['stack'])) {
            // "React,  Vue " -> ["React", "Vue"]
            $validated['stack'] = array_filter(array_map('trim', explode(',', $validated['stack'])));
        } else {
            $validated['stack'] = [];
        }

        // 4. Création (Le Slug est géré par le Model boot())
        Project::create($validated);

        return redirect()->route('admin.project.index')->with('success', 'Projet créé avec succès !');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
