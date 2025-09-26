'use client';

import { personalData, skills } from '@/lib/data';
import { Badge } from './ui/badge';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section id="about" className="container mx-auto py-16 px-4 md:py-24 md:px-6">
      <div className="grid gap-12 md:grid-cols-1">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src="https://picsum.photos/seed/avatar/120/120"
              alt={personalData.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-primary shadow-lg"
              data-ai-hint="professional portrait"
            />
            <div>
              <h3 className="text-2xl font-bold font-headline">{personalData.name}</h3>
              <p className="text-muted-foreground">{personalData.title}</p>
            </div>
          </div>
          <p className="text-lg text-foreground/80">{personalData.bio}</p>
          
          <div className="space-y-4">
            <h4 className="font-headline text-2xl font-bold">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="secondary" className="text-base py-1 px-3 flex items-center gap-2">
                    <skill.icon className="h-4 w-4 text-accent" />
                    {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
