<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminNewsletterController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/newsletter/index', [
            'subscribers' => Newsletter::query()
                ->when($request->search, function ($query, $search) {
                    $query->where('email', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function destroy(int $id)
    {
        Newsletter::destroy($id);

        return back()->with('success', 'Newsletter deleted.');
    }

    public function toggleActive(int $id)
    {
        $newsletter = Newsletter::findOrFail($id);

        $newsletter->update([
            'active' => !$newsletter->active
        ]);

        return back()->with('success', 'Newsletter updated.');
    }

    public function export()
    {
        $subscribers = Newsletter::all();
        $csvHeader = ['ID', 'Email', 'Statut', 'Date d\'inscription'];

        $response = new StreamedResponse(function () use ($subscribers, $csvHeader) {
            $handle = fopen('php://output', 'w');

            // Ajout du BOM pour l'encodage Excel (UTF-8)
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // En-tête
            fputcsv($handle, $csvHeader, ';');

            // Données
            foreach ($subscribers as $sub) {
                fputcsv($handle, [
                    $sub->id,
                    $sub->email,
                    $sub->active ? 'Actif' : 'Inactif',
                    $sub->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="export-newsletter-'.now()->format('d-m-Y').'.csv"');

        return $response;
    }
}
