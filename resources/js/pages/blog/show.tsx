import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CalendarDays,
    ChevronLeft,
    Share2,
    Bookmark,
    Sparkles,
} from 'lucide-react';
import MarkdownViewer from '@/components/markdown-viewer';
import { PostInterface, UserInterface } from '@/types';
import { blog, contact } from '@/routes';
import FloatBar from '@/pages/blog/float-bar';

export default function BlogShow({ post, user}: { post: PostInterface, user: UserInterface }) {
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

    console.log(post);

    return (
        <GuestLayout>
            <Head title={post.title} />

            <FloatBar post={post}/>

            <div className="min-h-screen bg-background pb-20">
                {/* --- HEADER HERO --- */}
                <div className="relative w-full overflow-hidden border-b bg-background pt-24 pb-16 md:pt-32 md:pb-24">
                    {/* --- EFFET DE FOND (AMBIENT GLOW) --- */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-[0.15] dark:opacity-[0.2] blur-[120px] pointer-events-none">
                            <div className="aspect-[16/9] w-full bg-gradient-to-tr from-blue-600 to-purple-500 rounded-full" />
                        </div>
                        {/* Grille de points subtile */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
                    </div>

                    <div className="container relative z-10 max-w-4xl mx-auto px-4">
                        <div className="flex flex-col space-y-8">

                            {/* --- TOP BAR --- */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <Link href={blog()} className="group">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <ChevronLeft className="h-4 w-4" />
                                        </div>
                                        Retour au blog
                                    </div>
                                </Link>

                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-1 rounded-full bg-border" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        Lecture : {post.reading_time || '5'} min
                    </span>
                                </div>
                            </div>

                            {/* --- TITRE & CATEGORIE --- */}
                            <div className="space-y-6">
                                {post.category && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                        <Sparkles className="h-3 w-3" />
                                        {post.category}
                                    </div>
                                )}

                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-balance">
                                    {post.title}
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl text-pretty font-medium">
                                    {post.description}
                                </p>
                            </div>

                            {/* --- AUTHOR & METAS --- */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-xl">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" title="En ligne" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">Dev full stack & devops</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Publié le</span>
                                        <span className="text-sm font-semibold flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-blue-500" />
                                            {formattedDate}
                        </span>
                                    </div>
                                    <Separator orientation="vertical" className="h-8 hidden sm:block" />
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-500 hover:text-white transition-all">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
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
                                <Button size="sm" className="w-full">
                                    <Link href={contact()} >Me contacter</Link>
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </GuestLayout>
    );
}
