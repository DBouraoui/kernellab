import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    slug: string;
    content: string;
    tags: string[];
    image: string[];
    thumbnail: string;
    reading_time: string;
    status: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface ContactType {
    id: number;
    name: string;
    email: string;
    phone?: string;
    reason: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectType {
    id: number;
    title: string;
    slug: string; // Pour l'URL SEO
    category: 'devops' | 'cloud' | 'web' | 'mobile' | 'opensource' | 'saas';
    status: 'draft' | 'published' | 'archived';
    stack: string[]; // ['Symfony', 'Docker', 'AWS', 'React Native']
    content: string;
    description_short: string;
    image_url?: string;
    github_url?: string;
    live_url?: string;
    created_at: string;
    is_featured: boolean; // Pour mettre en avant sur ta home
}
