import { Mail, Github, Linkedin, Send, Globe} from "lucide-react"
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
import GuestLayout from '@/layouts/guest-layout';

export default function ContactPage() {
    return (
        <GuestLayout>
            <div className="min-h-[calc(100vh-64px)] bg-background">
                <div className="container px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                        {/* --- GAUCHE : IDENTITÉ & RÉSEAUX (5/12) --- */}
                        <div className="lg:col-span-5 space-y-10">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                    Travaillons <span className="text-primary">ensemble.</span>
                                </h1>
                                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                                    Vous avez un projet complexe ou une infrastructure à automatiser ?
                                    Parlons de vos objectifs et voyons comment je peux vous aider à les atteindre.
                                </p>
                            </div>

                            {/* Cartes d'infos rapides */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border bg-card/50">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Email</p>
                                        <p className="font-medium">contact@ton-domaine.dev</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl border bg-card/50">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Localisation</p>
                                        <p className="font-medium">Lyon, France / Remote</p>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="flex gap-4">
                                <Button variant="outline" size="lg" className="flex-1 rounded-2xl gap-2" asChild>
                                    <a href="#"><Github className="h-5 w-5" /> GitHub</a>
                                </Button>
                                <Button variant="outline" size="lg" className="flex-1 rounded-2xl gap-2" asChild>
                                    <a href="#"><Linkedin className="h-5 w-5" /> LinkedIn</a>
                                </Button>
                            </div>
                        </div>

                        {/* --- DROITE : FORMULAIRE SHADCN (7/12) --- */}
                        <div className="lg:col-span-7">
                            <div className="bg-card border rounded-[2rem] p-6 md:p-10 shadow-sm">
                                <form className="space-y-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold ml-1 text-foreground/80">Nom complet</label>
                                            <Input placeholder="John Doe" className="h-12 rounded-xl border-muted-foreground/20 focus:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold ml-1 text-foreground/80">Adresse email</label>
                                            <Input type="email" placeholder="john@company.com" className="h-12 rounded-xl border-muted-foreground/20 focus:ring-primary" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 text-foreground/80">Objet de la demande</label>
                                        <Select>
                                            <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                                                <SelectValue placeholder="Sélectionnez une option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="freelance">Mise en place d'un projet Freelance</SelectItem>
                                                <SelectItem value="recruitment">Opportunité de carrière (Poste)</SelectItem>
                                                <SelectItem value="consulting">Consulting DevOps / Audit Cloud</SelectItem>
                                                <SelectItem value="other">Autre demande</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 text-foreground/80">Message</label>
                                        <Textarea
                                            placeholder="Décrivez brièvement votre besoin..."
                                            className="min-h-[160px] rounded-xl border-muted-foreground/20 focus:ring-primary resize-none p-4"
                                        />
                                    </div>

                                    <Button size="lg" className="w-full md:w-auto px-10 h-14 rounded-2xl font-bold gap-2 text-lg shadow-lg shadow-primary/10 transition-transform active:scale-95">
                                        Envoyer le message
                                        <Send className="h-5 w-5" />
                                    </Button>

                                    <p className="text-center md:text-left text-xs text-muted-foreground">
                                        En envoyant ce formulaire, vous acceptez d'être recontacté dans le cadre de votre demande.
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
