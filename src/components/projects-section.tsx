'use client';

import { projects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline sm:text-4xl md:text-5xl">
          My Projects
        </h2>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className={` ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                <Image
                  src={project.image.src}
                  alt={project.imageAlt}
                  width={project.image.width}
                  height={project.image.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
              </div>
              <div className="space-y-4">
                <p className="text-5xl font-extrabold text-gray-400">{project.index}</p>
                <h3 className="text-2xl font-bold sm:text-3xl">{project.title}</h3>
                <p className="text-gray-300 leading-relaxed">{project.summary}</p>
                <Link href={`/projects/${project.slug}`}
                  className="mt-4 inline-block"
                  aria-label={`Read the ${project.title} case study`}>
                    <ExternalLink className="w-6 h-6 hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
