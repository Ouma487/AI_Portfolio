import Header from '@/components/header';
import Footer from '@/components/footer';
import AboutSection from '@/components/about-section';
import ProjectsSection from '@/components/projects-section';
import ExperienceSection from '@/components/experience-section';
import ContactSection from '@/components/contact-section';
import { personalData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
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
        <section id="home" className="relative py-20 md:py-32">
             <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        {personalData.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground">
                        {personalData.title}
                    </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            <Link href="#projects">View My Work</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="#contact">Contact Me</Link>
                        </Button>
                    </div>
                </div>
                <div className="relative aspect-square max-w-md mx-auto md:max-w-none">
                  <Image 
                    src="https://picsum.photos/seed/hero/600/600"
                    alt="Hero image"
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint="abstract colorful"
                  />
                </div>
            </div>
        </section>
    )
}
