import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import SectionHeader from '@/components/section-header';

/**
 * An editorial index of projects. Each row is one link to the case study.
 * Desktop (fine pointer): the project image is revealed on hover/focus,
 * floating over the stack column. Touch screens and narrow viewports get a
 * static thumbnail at the top of each row instead.
 */
export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="frame pb-section">
      <SectionHeader
        id="projects"
        title={
          <>
            Selected <span className="text-outline">work</span>
          </>
        }
        intro="Case studies in applied machine learning. Each one opens into the problem, the approach and what came out of it."
      />

      <ol className="mt-16 border-b border-ink md:mt-24">
        {projects.map((project) => {
          const figure = project.highlights[0];
          return (
            <li key={project.slug} className="reveal border-t border-ink">
              <Link
                href={`/projects/${project.slug}`}
                className="project-row group relative grid-12 gap-y-4 py-8 md:py-10"
              >
                {/* Thumbnail: static on touch/narrow screens, hover reveal on desktop. */}
                <div
                  aria-hidden="true"
                  className="project-thumb pointer-events-none overflow-hidden md:col-span-5 md:col-start-2 md:row-start-2"
                >
                  <Image
                    src={project.image.src}
                    alt=""
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="mono-img aspect-[16/9] h-auto w-full object-cover"
                  />
                </div>

                <span className="label tabular-nums md:col-span-1 md:row-start-1">
                  {project.index}
                </span>

                <div className="md:col-span-6 md:col-start-2 md:row-start-1">
                  <h3 className="display text-step-4 transition-transform duration-500 ease-editorial group-hover:translate-x-2">
                    {project.title}
                  </h3>
                  <span className="mt-3 block max-w-measure text-step-1 text-mute">
                    {project.tagline}
                  </span>
                </div>

                <span className="project-stack label text-step--2 text-mute md:col-span-3 md:col-start-8 md:row-start-1">
                  {[project.year, project.partner?.split(' (')[0]].filter(Boolean).join(' · ')}
                  <span className="mt-2 block normal-case tracking-normal text-ink">
                    {project.stack.join(' / ')}
                  </span>
                </span>

                <span className="flex items-end justify-between gap-4 md:col-span-2 md:col-start-11 md:row-start-1 md:flex-col md:items-end md:justify-between md:text-right">
                  {figure ? (
                    <span className="block">
                      <span className="block font-mono text-step-4 font-medium leading-none tracking-tight">
                        {figure.value}
                      </span>
                      <span className="label mt-2 block text-step--2 text-mute">{figure.label}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    aria-hidden="true"
                    className="font-mono text-step-2 transition-transform duration-300 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
