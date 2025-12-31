import {z} from 'zod';

export const ContactSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    reason: z.string(),
    message: z.string(),
})

export const ArticleSchema = z.object({
    title: z.string().min(2, "Le titre est trop court"),
    description: z.string().min(2, "La description est requise"),
    content: z.string().min(10, "Le contenu est un peu vide..."),
    tags: z.array(z.string()).min(1, "Choisissez au moins un tag"),
    image: z.array(z.string()).min(1, "Une image de couverture est requise"),
    status: z.string().min(2, "Le status est requise"),
    reading_time: z.string().min(1, "Le reading time est requise"),
})
