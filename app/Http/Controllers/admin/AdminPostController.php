<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPostController extends Controller
{
    public function list()
    {
        $posts = Post::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/posts/list', compact('posts'));
    }

    public function edit(int $id) {

       $post = Post::findOrFail($id);

        return Inertia::render('admin/posts/edit', compact('post'));
    }

    public function create()
    {
        return Inertia::render('admin/posts/create');
    }

    public function delete(int $id)
    {
        $post = Post::findOrFail($id);

        if (!empty($post->image) && is_array($post->image)) {
            foreach ($post->image as $url) {
                $path = Str::after($url, '/storage/');

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $post->delete();

        return redirect()
            ->route('admin.post.list')
            ->with('success', 'Article supprimé avec succès');
    }

    /**
     * @param Request $request
     * @param int $id
     * @return RedirectResponse
     */
    public function update(Request $request, int $id)
    {
        $post = Post::findOrFail($id);

        // On valide (pense à mettre à jour tes règles si besoin)
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'reading_time' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'tags' => 'nullable|array',
        ]);

        // On update tout sauf le thumbnail (comme demandé)
        $post->update($data);

        // On redirige vers la liste avec un message flash
        return redirect()
            ->route('admin.post.list') // Vérifie bien le nom de ta route ici
            ->with('success', 'Article mis à jour avec succès');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['required', 'string', 'min:2', 'max:255'],
            'content' => ['required', 'string'],
            'tags' => ['required', 'array', 'min:1'],
            'image' => 'nullable|array',
            'reading_time' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],
            'thumbnail' => ['nullable', 'string'],
            'category' => ['required', 'string'],
            'published_at' => ['nullable', 'string'],
        ]);

        Post::create([
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'slug'        => Str::slug($validated['title']),
            'content'     => $validated['content'],
            'tags'        => $validated['tags'],
            'image'       => $validated['image'],
            'reading_time' => $validated['reading_time'],
            'status'      => $validated['status'],
            'thumbnail'   => $validated['thumbnail'],
            'category' => $validated['category'],
            'published_at' => $validated['published_at'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('admin.post.list')->with('success', 'Article créé !');
    }

    public function uploadImages(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $urls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // On stocke dans storage/app/public/posts
                $path = $image->store('posts', 'public');
                // On génère l'URL publique
                $urls[] = Storage::url($path);
            }
        }

        return response()->json(['urls' => $urls]);
    }

    public function deleteImage(Request $request)
    {
        $url = $request->url;
        $path = Str::after($url, '/storage/');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'Fichier supprimé']);
        }

        return response()->json(['message' => 'Fichier introuvable'], 404);
    }

    public function uploadThumbnail(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072'
        ]);

        if ($request->hasFile('image')) {
            // On stocke dans un dossier spécifique pour les couvertures
            $path = $request->file('image')->store('posts/thumbnails', 'public');
            $url = Storage::url($path);

            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }

    public function deleteThumbnail(Request $request)
    {
        $url = $request->url;

        $path = Str::after($url, '/storage/');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'Thumbnail supprimé du serveur']);
        }

        return response()->json(['message' => 'Fichier introuvable'], 404);
    }
}
