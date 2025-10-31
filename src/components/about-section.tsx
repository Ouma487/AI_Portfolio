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
              src="/images/me.svg" 
              alt="Oumaima Chater"
              width={400}
              height={500}
              className="rounded-xl shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline sm:text-4xl md:text-5xl">
              About Me
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
             {personalData.details}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
