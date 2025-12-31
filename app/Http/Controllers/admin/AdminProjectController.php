<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
    public function edit(int $id)
    {
        $project = Project::findOrFail($id);

        // Important : On transforme l'array ['React', 'PHP'] en "React, PHP" pour le frontend
        if (is_array($project->stack)) {
            $project->stack_string = implode(', ', $project->stack);
        }

        return Inertia::render('admin/project/edit', [
            'project' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:devops,cloud,web,mobile,opensource,saas',
            'status' => 'required|in:draft,published,archived',
            'description_short' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'stack' => 'nullable|string', // Reçu en string depuis le front
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'is_featured' => 'boolean',
        ]);

        // 1. Gestion de l'image
        if ($request->hasFile('thumbnail')) {
            // Supprimer l'ancienne image si elle existe
            if ($project->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $project->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('thumbnail')->store('projects', 'public');
            $validated['thumbnail_url'] = '/storage/' . $path;
        }

        // 2. Transformation de la Stack (String -> Array)
        if (!empty($validated['stack'])) {
            $validated['stack'] = array_filter(array_map('trim', explode(',', $validated['stack'])));
        } else {
            $validated['stack'] = [];
        }

        // 3. Update
        $project->update($validated);

        return redirect()->route('admin.project.index')->with('success', 'Projet mis à jour !');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $project = Project::findOrFail($id);

        // On vérifie si le projet a une image et si elle existe sur le disque
        if ($project->thumbnail_url) {
            // On transforme l'URL publique (/storage/projects/...) en chemin relatif (projects/...)
            $path = str_replace('/storage/', '', $project->thumbnail_url);

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $project->delete();

        // Comme tu n'utilises pas le helper route(), on redirige vers l'URL en dur
        return redirect('/dashboard/projects');
    }

    public function toggleFeatured(int $id)
    {
        $project =  Project::findOrFail($id);

        $project->is_featured = $project->is_featured ? 0 : 1;

        $project->save();

        return redirect()->route('admin.project.index');
    }
}
