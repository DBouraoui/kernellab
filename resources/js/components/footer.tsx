import { Mountain, Github, Linkedin, Twitter, Terminal } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-background/50 backdrop-blur-sm">
            <div className="container px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* --- BRANDING --- */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <img
                                src="/images/kernellab-logo.webp"
                                className="max-h-14 dark:invert"
                                alt="kernellab-logo"
                            />
                            <span>KernelLab.</span>
                        </a>
                        <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                            Bâtir des infrastructures solides pour des applications d'exception.
                        </p>
                    </div>

                    {/* --- NAVIGATION RAPIDE --- */}
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
                        <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
                        <a href="/projets" className="hover:text-primary transition-colors">Projets</a>
                        <a href="/about" className="hover:text-primary transition-colors">À propos</a>
                        <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
                    </nav>

                    {/* --- SOCIALS --- */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">aedIn</span>
                        </a>
                        <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span>© {currentYear} Kernellab. Tous droits réservés.</span>
                        <span className="hidden md:inline text-muted-foreground/30">|</span>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span>System Status: All systems operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono opacity-50">
                        <Terminal className="h-3 w-3" />
                        <span>v1.0.4-stable</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
