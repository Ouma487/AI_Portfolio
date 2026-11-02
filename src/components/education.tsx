'use client';

import { education } from '@/lib/data';
import { Card } from './ui/card';




const EducationSection = () => {
  return (
    <section id="education" className="py-16 md:py-24 bg-white text-black font-sora">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl text-center mb-12 font-headline sm:text-4xl md:text-5xl">
          My <span className="font-bold">Education</span>
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <Card
              key={index}
              className={`p-6 md:p-8 border-none shadow-none rounded-lg transition-all duration-300 ${
                index === 0
                  ? 'bg-[#000000] text-white'
                  : 'bg-[#404040] text-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <div>
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl font-bold leading-snug ${
                      index === 0 ? 'text-white' : 'text-white'
                    }`}
                  >
                    {edu.degree}
                  </h3>
                  <p
                    className={`text-sm md:text-base mt-1 ${
                      index === 0 ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  >
                    {edu.institution}
                  </p>
                </div>
                <p
                  className={`text-sm md:text-base ${
                    index === 0 ? 'text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {edu.period}
                </p>
              </div>

              <p
                className={`text-[16px] leading-[24px] tracking-[0.02em] ${
                  index === 0 ? 'text-gray-300' : 'text-gray-200'
                }`}
              >
                {edu.summary ?? edu.coursework?.join(' · ')}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
