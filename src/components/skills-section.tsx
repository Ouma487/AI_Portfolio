'use client';

import { skills } from '@/lib/data';
import { Card } from './ui/card';
import Image from 'next/image';

const SkillsSection = () => {
  const skillsToShow = skills.slice(0, 8);

  return (
    <section id="skills" className="py-16 md:py-24 bg-gray-50 font-sora">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl text-center mb-12 sm:text-4xl md:text-5xl">
          My <span className="font-bold">Skills</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {skillsToShow.map((skill) => (
            <Card
              key={skill.name}
              className={`flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 border border-black aspect-square rounded-none ${
                skill.name === 'PyTorch' ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                width={48}
                height={48}
                className={`h-12 w-12 mb-4 object-contain ${
                  skill.name === 'PyTorch' ? 'brightness-0 invert' : ''
                }`}
              />
              <p className="text-[16px] font-bold leading-[24px] tracking-[0.02em]">
                {skill.name}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
