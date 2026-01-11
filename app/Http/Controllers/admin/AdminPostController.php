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
    protected $disk = 's3';

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

        // 1. Suppression des images multiples (le tableau)
        if (!empty($post->image) && is_array($post->image)) {
            foreach ($post->image as $url) {
                $path = $this->extractPathFromUrl($url);

                if (Storage::disk('s3')->exists($path)) {
                    Storage::disk('s3')->delete($path);
                }
            }
        }

        // 2. Suppression de la Thumbnail (si tu as un champ 'thumbnail' dans ta table)
        if (!empty($post->thumbnail)) {
            $thumbPath = $this->extractPathFromUrl($post->thumbnail);
            if (Storage::disk('s3')->exists($thumbPath)) {
                Storage::disk('s3')->delete($thumbPath);
            }
        }

        // 3. Suppression de l'entrée en base de données
        $post->delete();

        return redirect()
            ->route('admin.post.list')
            ->with('success', 'Article et images supprimés d\'OVH avec succès');
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
                // On stocke sur S3. Le 3ème paramètre 'public' assure la visibilité
                $path = $image->store('posts', $this->disk);
                // On génère l'URL (qui sera https://votre-bucket.s3.gra.io...)
                $urls[] = Storage::disk($this->disk)->url($path);
            }
        }

        return response()->json(['urls' => $urls]);
    }

    public function deleteImage(Request $request)
    {
        $url = $request->url;
        // Sur S3, le chemin est ce qui vient APRÈS l'URL de base du bucket
        // On récupère le chemin relatif (ex: posts/image.jpg)
        $path = $this->extractPathFromUrl($url);

        if (Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
            return response()->json(['message' => 'Fichier supprimé d\'OVH']);
        }

        return response()->json(['message' => 'Fichier introuvable sur S3'], 404);
    }

    public function uploadThumbnail(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts/thumbnails', $this->disk);
            $url = Storage::disk($this->disk)->url($path);

            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }

    public function deleteThumbnail(Request $request)
    {
        $url = $request->url;
        $path = $this->extractPathFromUrl($url);

        if (Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
            return response()->json(['message' => 'Thumbnail supprimé d\'OVH']);
        }

        return response()->json(['message' => 'Fichier introuvable'], 404);
    }

    /**
     * Petite fonction helper pour extraire le chemin relatif
     */
    private function extractPathFromUrl($url)
    {
        // 1. On récupère uniquement la partie "chemin" de l'URL (ex: /ton-bucket/posts/image.jpg)
        $path = parse_url($url, PHP_URL_PATH);

        // 2. On retire le nom du bucket s'il est présent dans le chemin (cas du Path Style d'OVH)
        $bucketName = config('filesystems.disks.s3.bucket');
        if (Str::contains($path, $bucketName)) {
            $path = Str::after($path, $bucketName);
        }

        // 3. TRÈS IMPORTANT : On retire le slash au début.
        // S3 veut "posts/image.jpg" et NON "/posts/image.jpg"
        return ltrim($path, '/');
    }
}
