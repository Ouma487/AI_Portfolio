'use client';

import { experience } from '@/lib/data';
import { Card } from './ui/card';
import Image from 'next/image';

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="py-16 md:py-24 bg-black text-white font-sora"
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline sm:text-4xl md:text-5xl">
          My Experience
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {experience.map((exp, index) => (
            <Card
              key={index}
              className={`p-6 md:p-8 transition-all duration-300 border-none shadow-none rounded-lg ${
                index === 0
                  ? 'bg-[#E4E4E7] text-black'
                  : index === 1
                  ? 'bg-[#404040] text-gray-200'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                {exp.logo && (
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    )}

                  <h3 className="text-xl md:text-2xl font-bold">
                    {exp.role} @{exp.company}
                  </h3>
                </div>
                <p
                  className={`text-sm md:text-base ${
                    index === 0
                      ? 'text-gray-600'
                      : index === 1
                      ? 'text-gray-300'
                      : 'text-gray-400'
                  }`}
                >
                  {exp.date}
                </p>
              </div>
              <p
                className={`text-[16px] leading-[24px] tracking-[0.02em] ${
                  index === 0
                    ? 'text-gray-700'
                    : index === 1
                    ? 'text-gray-200'
                    : 'text-gray-400'
                }`}
              >
                {exp.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
