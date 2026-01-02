import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, ChevronLeft, Share2, Bookmark } from 'lucide-react';
import MarkdownViewer from '@/components/markdown-viewer';
import { PostInterface } from '@/types';
import { blog } from '@/routes';

export default function BlogShow({ post }: { post: PostInterface }) {
    // État pour la Table des Matières (TOC)
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    // Extraction des titres pour la TOC
    useEffect(() => {
        const regex = /^(#{2,3})\s+(.+)$/gm;
        const found = [];
        let match;
        while ((match = regex.exec(post.content)) !== null) {
            const level = match[1].length; // ## = 2, ### = 3
            const text = match[2];
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            found.push({ id, text, level });
        }
        setHeadings(found);
    }, [post.content]);

    // Intersection Observer pour surligner le titre actif au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -60% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const formattedDate = new Date(post.published_at).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <GuestLayout>
            <Head title={post.title} />

            {/* Barre de progression de lecture (Optionnel, code CSS simple à ajouter) */}

            <div className="min-h-screen bg-background pb-20">
                {/* --- HEADER HERO --- */}
                <div className="relative w-full bg-muted/30 border-b pb-12 pt-24 md:pt-32">
                    <div className="container max-w-4xl mx-auto px-4">
                        <div className="space-y-6 text-center md:text-left">
                            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                                <Link href={blog()}>
                                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground pl-0">
                                        <ChevronLeft className="h-4 w-4" /> Retour
                                    </Button>
                                </Link>
                                {post.category && (
                                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white uppercase tracking-wider font-bold">
                                        {post.category}
                                    </Badge>
                                )}
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" /> {formattedDate}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {post.reading_time || '5 min'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                                {post.title}
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                {post.description}
                            </p>

                            {/* Author section (Static example if no user relation yet) */}
                            <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Admin</p>
                                    <p className="text-xs text-muted-foreground">Développeur Fullstack</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT & SIDEBAR --- */}
                <div className="container max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Colonne Gauche: Share buttons (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32 flex flex-col gap-4 items-center">
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-blue-500" title="Partager">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-yellow-500" title="Sauvegarder">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </div>
                    </aside>

                    {/* Colonne Centrale: Article */}
                    <article className="lg:col-span-8">
                        {post.thumbnail && (
                            <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 border border-border/50">
                                <img src={post.thumbnail} alt={post.title} className="w-full object-cover max-h-[500px]" />
                            </div>
                        )}

                        {/* Le contenu Markdown rendu proprement */}
                        <div className="mb-16">
                            <MarkdownViewer content={post.content} />
                        </div>

                        <Separator className="my-8" />

                        {/* Tags Footer */}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </article>

                    {/* Colonne Droite: Table des matières (Sticky) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-32 space-y-8">
                            {headings.length > 0 && (
                                <div className="p-6 rounded-xl bg-card border shadow-sm">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                                        Dans cet article
                                    </h4>
                                    <nav className="flex flex-col space-y-1">
                                        {headings.map((heading) => (
                                            <a
                                                key={heading.id}
                                                href={`#${heading.id}`}
                                                className={`text-sm py-1.5 transition-colors border-l-2 pl-4 ${
                                                    activeId === heading.id
                                                        ? 'border-blue-600 text-blue-600 font-medium'
                                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                                } ${heading.level === 3 ? 'ml-2' : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                {heading.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {/* Promo Box / Newsletter pourrait aller ici */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900">
                                <h4 className="font-bold mb-2">Besoin d'un dev ?</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Je suis disponible pour des missions freelance sur Laravel & React.
                                </p>
                                <Button size="sm" className="w-full">Me contacter</Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </GuestLayout>
    );
}
