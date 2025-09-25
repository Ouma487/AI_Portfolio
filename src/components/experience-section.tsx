import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { personalData, experience, education } from '@/lib/data';

const TimelineItem = ({ title, subtitle, date, description }: { title: string; subtitle: string; date: string; description: string }) => (
    <div className="relative pl-8 before:absolute before:top-2 before:left-2 before:h-full before:w-px before:bg-border last:before:hidden">
        <div className="absolute top-2 left-2 -translate-x-1/2">
            <div className="size-3 rounded-full bg-primary" />
        </div>
        <h3 className="font-headline text-xl font-bold">{title}</h3>
        <h4 className="font-medium text-primary">{subtitle}</h4>
        <p className="text-sm text-muted-foreground mb-2">{date}</p>
        <p className="text-foreground/80">{description}</p>
    </div>
);


const ExperienceSection = () => {
  return (
    <section id="experience" className="container mx-auto py-16 px-4 md:py-24 md:px-6">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          My Journey
        </h2>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          A summary of my professional experience and academic background.
        </p>
        <Button asChild>
          <a href={personalData.resumeUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </a>
        </Button>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className='space-y-8'>
            <h3 className="font-headline text-2xl font-bold">Work Experience</h3>
            <div className='space-y-8'>
                {experience.map((item, index) => (
                    <TimelineItem key={index} title={item.company} subtitle={item.role} date={item.date} description={item.description} />
                ))}
            </div>
        </div>
        <div className='space-y-8'>
            <h3 className="font-headline text-2xl font-bold">Education</h3>
            <div className='space-y-8'>
                {education.map((item, index) => (
                    <TimelineItem key={index} title={item.institution} subtitle={item.degree} date={item.date} description={item.description} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
