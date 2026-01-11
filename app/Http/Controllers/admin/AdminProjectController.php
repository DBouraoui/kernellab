<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProjectController extends Controller
{

    protected $disk = 's3';

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:devops,cloud,web,mobile,opensource,saas',
            'status' => 'required|in:draft,published,archived',
            'description_short' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'stack' => 'nullable|string',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'is_featured' => 'boolean',
        ]);

        // Gestion de l'upload vers S3
        if ($request->hasFile('thumbnail')) {
            // On stocke sur OVH (dossier projects)
            $path = $request->file('thumbnail')->store('projects', $this->disk);
            // On enregistre l'URL complète du bucket (https://...)
            $validated['thumbnail_url'] = Storage::disk($this->disk)->url($path);
        }

        if (!empty($validated['stack'])) {
            $validated['stack'] = array_filter(array_map('trim', explode(',', $validated['stack'])));
        } else {
            $validated['stack'] = [];
        }

        Project::create($validated);

        return redirect()->route('admin.project.index')->with('success', 'Projet créé avec succès sur OVH !');
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
            'stack' => 'nullable|string',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            // 1. Supprimer l'ancienne image du bucket
            if ($project->thumbnail_url) {
                $oldPath = $this->extractPathFromUrl($project->thumbnail_url);
                if (Storage::disk($this->disk)->exists($oldPath)) {
                    Storage::disk($this->disk)->delete($oldPath);
                }
            }

            // 2. Upload la nouvelle vers S3
            $path = $request->file('thumbnail')->store('projects', $this->disk);
            $validated['thumbnail_url'] = Storage::disk($this->disk)->url($path);
        }

        if (!empty($validated['stack'])) {
            $validated['stack'] = array_filter(array_map('trim', explode(',', $validated['stack'])));
        } else {
            $validated['stack'] = [];
        }

        $project->update($validated);

        return redirect()->route('admin.project.index')->with('success', 'Projet mis à jour !');
    }

    public function destroy(int $id)
    {
        $project = Project::findOrFail($id);

        // Nettoyage de l'image sur S3
        if ($project->thumbnail_url) {
            $path = $this->extractPathFromUrl($project->thumbnail_url);
            if (Storage::disk($this->disk)->exists($path)) {
                Storage::disk($this->disk)->delete($path);
            }
        }

        $project->delete();

        return redirect('/dashboard/projects')->with('success', 'Projet et image supprimés de S3');
    }

    /**
     * Helper pour extraire le chemin relatif de l'URL S3
     */
    private function extractPathFromUrl($url)
    {
        $path = parse_url($url, PHP_URL_PATH);
        $bucketName = config('filesystems.disks.s3.bucket');

        if (Str::contains($path, $bucketName)) {
            $path = Str::after($path, $bucketName);
        }

        return ltrim($path, '/');
    }

    public function toggleFeatured(int $id)
    {
        $project =  Project::findOrFail($id);

        $project->is_featured = $project->is_featured ? 0 : 1;

        $project->save();

        return redirect()->route('admin.project.index');
    }
}
