'use client';

import { use } from 'react';
import { projects } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const router = useRouter();
  const { id } = use(params); 
  const project = projects.find((p) => p.id.toLowerCase() === id.toLowerCase());

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* --- Project Overview Section --- */}
      <main className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="w-full">
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={450}
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>

          <div className="flex flex-col space-y-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-fit border border-black bg-black text-white hover:bg-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div>
              <p className="text-5xl md:text-6xl font-extrabold text-gray-300 leading-none">
                {project.id}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">
                {project.title}
              </h1>
            </div>

            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>
        </div>
      </main>

      {/* --- Key Features Section --- */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 font-headline">
            Key <span className="text-white/80">Features</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
              <ul className="space-y-3 list-disc list-inside text-gray-300 text-sm md:text-base">
                {project.keyFeatures.left.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-200 text-gray-900 p-8 rounded-xl shadow-lg">
              <ul className="space-y-3 list-disc list-inside text-sm md:text-base">
                {project.keyFeatures.right.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
