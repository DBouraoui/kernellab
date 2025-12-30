import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';

export function Articles() {
    const articles = [
        {
            title: "Optimiser les pipelines CI/CD avec ArgoCD",
            description: "Découvrez comment ArgoCD peut transformer vos déploiements Kubernetes et les rendre GitOps-compatibles.",
            category: "DevOps",
            date: "12 Octobre 2024",
            readTime: "8 min",
            link: "/blog/optimiser-pipelines-argocd",
            image: "/blog-image-argocd.jpg", // Remplace par tes images
            gradient: "from-orange-500 to-red-600"
        },
        {
            title: "Build System en Go : Quand et pourquoi ?",
            description: "Exploration des avantages et cas d'usage d'un build system écrit en Go pour les microservices.",
            category: "Backend",
            date: "28 Septembre 2024",
            readTime: "7 min",
            link: "/blog/build-system-go",
            image: "/blog-image-go.jpg",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            title: "Design System avec Shadcn/UI et Tailwind",
            description: "Guide complet pour construire un Design System robuste et modulaire en utilisant les dernières pratiques front-end.",
            category: "Frontend",
            date: "15 Septembre 2024",
            readTime: "10 min",
            link: "/blog/design-system-shadcn-tailwind",
            image: "/blog-image-shadcn.jpg",
            gradient: "from-blue-600 to-cyan-500"
        },
    ]

    return (
        <section className="py-24 bg-muted/10 relative overflow-hidden">
            {/* Léger halo de couleur en fond pour l'ambiance */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[400px] w-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-1/4 right-0 h-[300px] w-[300px] bg-orange-500/5 blur-[100px] rounded-full -z-10"></div>

            <div className="container px-4">
                {/* Header de la section Blog */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Derniers <span className="text-muted-foreground font-light">Articles</span>
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            Analyses, tutoriels et réflexions sur le développement Full Stack, le Cloud et le DevOps.
                        </p>
                        <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 to-orange-500 mt-4 rounded-full" />
                    </div>
                    <Button variant="outline" className="rounded-full gap-2 border-2 hover:bg-foreground hover:text-background transition-all">
                        Voir tous les articles
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Grille des articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <a
                            key={article.title}
                            href={article.link}
                            className="group relative flex flex-col rounded-[2.5rem] border bg-card/50 hover:border-transparent transition-all duration-500 overflow-hidden"
                        >
                            {/* BORDURE GRADIENT AU HOVER comme pour les projets */}
                            <div className={`absolute inset-0 rounded-[2.5rem] p-[2px] bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 shadow-xl shadow-primary/10`} />
                            <div className="absolute inset-0 rounded-[2.5rem] bg-card -z-10" />

                            {/* Image de l'article */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-t-[2.5rem] bg-muted/30">
                                {/* Ici, tu peux mettre un composant Image de Next.js */}
                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-muted-foreground text-sm font-medium">
                                    {/* <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform" /> */}
                                    Image d'article
                                </div>
                            </div>

                            {/* Contenu textuel */}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <Badge
                                        variant="outline"
                                        className={`mb-4 border-2 bg-gradient-to-r ${article.gradient} text-white font-bold px-3 py-1 rounded-full text-xs uppercase`}
                                    >
                                        {article.category}
                                    </Badge>
                                    <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors group-hover:translate-x-1">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {article.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-dashed border-muted-foreground/20 text-xs text-muted-foreground flex justify-between items-center">
                                    <span>{article.date}</span>
                                    <span>{article.readTime}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
