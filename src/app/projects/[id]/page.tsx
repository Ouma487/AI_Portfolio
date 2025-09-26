'use client';

import { useParams } from 'next/navigation';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import React from 'react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const project = projects.find((p) => p.id === projectId);
  const image = PlaceHolderImages.find(img => img.id === project?.imagePlaceholderId);

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <Button asChild variant="link" className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
            <div className='mb-6 md:mb-8'>
                <Button asChild variant="ghost" className="pl-0 text-sm md:text-base">
                    <Link href="/#projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        All Projects
                    </Link>
                </Button>
            </div>
          <article className="mx-auto max-w-4xl">
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              {project.title}
            </h1>
            
            {image && (
              <div className="relative h-60 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden my-6 md:my-8 shadow-lg">
                <Image
                  src={image.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              </div>
            )}
            
            <div className="prose prose-base md:prose-lg max-w-none text-foreground/80">
                <p className="lead text-lg md:text-xl">{project.description}</p>
                
                <p>
                    This project showcases the implementation of various modern technologies to deliver a robust and efficient solution. The primary goal was to address a key challenge in its domain by leveraging cutting-edge techniques and a user-centric design approach.
                </p>

                <p>
                    Throughout the development process, a strong emphasis was placed on code quality, scalability, and maintainability. The architecture was designed to be modular, allowing for easy integration of new features and adaptation to future requirements.
                </p>
            </div>

            <div className="my-6 md:my-8">
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-4">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm md:text-base py-1 px-3">{tech}</Badge>
                ))}
              </div>
            </div>

            <div className="my-6 md:my-8">
                <Button asChild>
                    <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {project.link.label}
                    </a>
                </Button>
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
