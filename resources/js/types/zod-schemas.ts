import {z} from 'zod';

export const ContactSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    reason: z.string(),
    message: z.string(),
})
