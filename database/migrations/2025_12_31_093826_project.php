<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // Pour des URLs SEO : /projects/mon-super-saas

            // Catégorisation pour le filtrage
            $table->enum('category', ['devops', 'cloud', 'web', 'mobile', 'opensource', 'saas'])->default('web');

            // Contenu
            $table->text('description_short')->nullable(); // Résumé pour les cards
            $table->longText('content')->nullable(); // Corps de l'étude de cas (Markdown ou HTML)
            $table->string('thumbnail_url')->nullable(); // Image principale

            // Données techniques
            $table->json('stack')->nullable(); // Array des technos : ["Symfony", "Docker", "AWS"]

            // Liens externes
            $table->string('github_url')->nullable();
            $table->string('live_url')->nullable(); // Lien vers le SaaS ou site en prod

            // Gestion de l'affichage
            $table->boolean('is_featured')->default(false); // Mis en avant sur la home ?
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
