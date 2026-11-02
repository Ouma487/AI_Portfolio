import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProjectBySlug, personalData, projects } from '@/lib/data';
import BackButton from './back-button';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render one static page per project at build time.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Any slug not listed above is a 404 instead of an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} · ${personalData.name}`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.image.src, width: project.image.width, height: project.image.height, alt: project.imageAlt }],
    },
  };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* --- Project Overview Section --- */}
      <main className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="w-full">
            <Image
              src={project.image.src}
              alt={project.imageAlt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              priority
            />
          </div>

          <div className="flex flex-col space-y-6">
            <BackButton />

            <div>
              <p className="text-5xl md:text-6xl font-extrabold text-gray-300 leading-none">
                {project.index}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">
                {project.title}
              </h1>
            </div>

            <p className="text-gray-700 leading-relaxed">{project.summary}</p>
            <p className="text-gray-700 leading-relaxed">{project.context}</p>
          </div>
        </div>
      </main>

      {/* --- Approach & Results Section --- */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 font-headline">Approach</h2>
              <ul className="space-y-3 list-disc list-inside text-gray-300 text-sm md:text-base">
                {project.approach.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-200 text-gray-900 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 font-headline">Results</h2>
              <ul className="space-y-3 list-disc list-inside text-sm md:text-base">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
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
