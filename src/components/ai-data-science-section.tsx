'use client';

import { Card } from './ui/card';

const aiDataScienceSkills = [
  { name: 'Machine Learning' },
  { name: 'Deep Learning' },
  { name: 'NLP' },
  { name: 'Computer Vision' },
  { name: 'Reinforcement Learning' },
  { name: 'Probabilities' },
  { name: 'Statistics' },
  { name: 'LLMs' },
];

const AiDataScienceSection = () => {
  return (
    <section id="ai-data-science" className="py-16 md:py-24 bg-gray-50 font-sora">
      <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-3xl text-center mb-12 font-headline sm:text-4xl md:text-5xl">
          AI &<span className="font-bold"> Data Science</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {aiDataScienceSkills.map((skill) => (
            <Card
              key={skill.name}
              className={`flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 aspect-square rounded-none font-bold text-lg border border-black ${
                skill.name === 'Deep Learning'
                  ? 'bg-black text-white'
                  : 'bg-white'
              }`}
            >
              {skill.name}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiDataScienceSection;
