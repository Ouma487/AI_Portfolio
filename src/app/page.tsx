
import AboutSection from '@/components/about-section';
import ProjectsSection from '@/components/projects-section';
import ExperienceSection from '@/components/experience-section';
import Contact from '@/components/contact';

import { getSocial, personalData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Github, Linkedin } from 'lucide-react';
import SkillsSection from '@/components/skills-section';
import AiDataScienceSection from '@/components/ai-data-science-section';
import EducationSection from '@/components/education';


export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <SkillsSection />
      <AiDataScienceSection />
      <ExperienceSection />
      <EducationSection />
      <AboutSection />
      <ProjectsSection />
      <Contact />
    </main>
  );
}





function HeroSection() {
  return (
    <section className="py-24 px-8 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-16">
        
        {/* Left Column: Text */}
        <div className="space-y-6 max-w-2xl">
          <div className="text-4xl sm:text-5xl font-light leading-snug">
          <p>
          Hello I’m{' '}
          <span className="font-bold whitespace-nowrap">{personalData.name}</span>
        </p>

        <h1 className="text-4xl sm:text-5xl font-light leading-snug">
            <span className="font-bold text-black">AI </span>
            <span className="text-outline">Engineer</span>
          </h1>


            <p>Based In <span className="font-extrabold text-black">{personalData.location}.</span></p>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {personalData.bio}
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-2">
            <a
              href={getSocial('linkedin')?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-3 rounded"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={getSocial('github')?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black p-3 rounded"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={getSocial('email')?.url}
              className="border border-black p-3 rounded"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Column: Illustration */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src={personalData.heroImage.src}
            alt={personalData.heroImageAlt}
            width={personalData.heroImage.width}
            height={personalData.heroImage.height}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
