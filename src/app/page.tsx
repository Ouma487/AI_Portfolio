import Header from '@/components/header';
import Footer from '@/components/footer';
import AboutSection from '@/components/about-section';
import ProjectsSection from '@/components/projects-section';
import ExperienceSection from '@/components/experience-section';
import ContactSection from '@/components/contact-section';
import { personalData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
    return (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center bg-secondary px-4">
             <div className="container mx-auto z-10 space-y-6">
                <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    {personalData.name}
                </h1>
                <p className="mx-auto max-w-[700px] text-primary/80 text-lg md:text-xl">
                    {personalData.title}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href="#projects">View My Work</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="#contact">Contact Me</Link>
                    </Button>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Link href="#about" aria-label="Scroll to about section">
                    <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
                </Link>
            </div>
        </section>
    )
}
