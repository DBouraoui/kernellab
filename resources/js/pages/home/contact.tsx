import { Mail, Send, Github, Linkedin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function Contact() {
    return (
        <section className="py-24 container px-4 bg-transparent">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

                    {/* --- INFOS DE CONTACT (2/5 de la largeur) --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">On discute ?</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Besoin d'un audit DevOps, d'un renfort Full Stack ou simplement envie d'échanger sur un projet Open Source ?
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">contact@ton-domaine.dev</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group">
                                <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">Dispo pour missions Freelance</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* --- FORMULAIRE ÉPURÉ (3/5 de la largeur) --- */}
                    <div className="lg:col-span-3">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input placeholder="Nom complet" className="bg-transparent border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Input type="email" placeholder="Email professionnel" className="bg-transparent border-muted-foreground/20 focus-visible:ring-primary h-12 rounded-xl" />
                                </div>
                            </div>

                            {/* Champ de précision (Sélecteur Shadcn) */}
                            <div className="space-y-2">
                                <Select>
                                    <SelectTrigger className="h-12 border-muted-foreground/20 rounded-xl bg-transparent">
                                        <SelectValue placeholder="Objet de votre message" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="freelance">Projet Freelance</SelectItem>
                                        <SelectItem value="recruitment">Proposition de poste (CDI/CDD)</SelectItem>
                                        <SelectItem value="open-source">Collaboration Open Source</SelectItem>
                                        <SelectItem value="coffee">Discuter Tech / Café</SelectItem>
                                        <SelectItem value="other">Autre demande</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Dites-m'en plus sur votre projet ou votre idée..."
                                    className="bg-transparent border-muted-foreground/20 focus-visible:ring-primary rounded-xl min-h-[150px] resize-none"
                                />
                            </div>

                            {/* Bouton sobre mais avec un rappel de couleur subtil */}
                            <Button className="relative w-full sm:w-auto px-8 h-12 rounded-xl font-bold overflow-hidden group transition-all">
                                {/* Bordure de couleur qui apparaît au hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <span className="flex items-center gap-2">
                  Envoyer le message
                  <Send className="h-4 w-4" />
                </span>
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}
