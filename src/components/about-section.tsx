'use client';

import Image from 'next/image';
import { personalData } from '@/lib/data';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full max-w-sm mx-auto">
            <Image
              src={personalData.portrait.src}
              alt={personalData.portraitAlt}
              width={personalData.portrait.width}
              height={personalData.portrait.height}
              sizes="(min-width: 768px) 384px, 100vw"
              className="rounded-xl shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline sm:text-4xl md:text-5xl">
              About Me
            </h2>
            {personalData.about.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
