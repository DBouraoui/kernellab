import GuestLayout from '@/layouts/guest-layout';
import Hero from '@/pages/home/hero';
import TechStack from '@/pages/home/tech-stack';
import Projects  from '@/pages/home/projects';
import { Articles } from '@/pages/home/articles';
import { Contact } from '@/pages/home/contact';

export default function Index() {

    return (
        <>
           <GuestLayout>
               <Hero />
               <TechStack />
               <Projects />
               <Articles/>
               <Contact />
           </GuestLayout>
        </>
    );
}
