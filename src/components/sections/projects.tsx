import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import SectionHeader from '@/components/section-header';
import { InkRule, Underlined } from '@/components/ink';
import { cn } from '@/lib/utils';

/**
 * Each project is a journal spread: the cover mounted like a photograph on one
 * side, the dated entry on the other, alternating down the page. The title is
 * the link; its ::after covers the whole spread, so the spread is one target
 * but screen readers hear a single, well-named link.
 */
export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="frame pb-section">
      <SectionHeader
        id="projects"
        title="Selected work"
        intro="Case studies in applied machine learning. Each entry opens into the problem, the approach and what came out of it."
      />

      <ol className="mt-16 space-y-20 md:mt-24 md:space-y-28">
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          const meta = [project.period ?? project.year, project.partner?.split(' (')[0]].filter(Boolean);
          return (
            <li key={project.slug} className="reveal">
              <article className="group relative grid-12 items-center gap-y-8">
                <div
                  className={cn(
                    'mounted md:col-span-6 md:row-start-1 lg:col-span-5',
                    flip ? 'md:col-start-7 lg:col-start-8' : 'md:col-start-1'
                  )}
                >
                  <Image
                    src={project.image.src}
                    alt=""
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(min-width: 1440px) 540px, (min-width: 768px) 45vw, 100vw"
                    className="aspect-[16/10] h-auto w-full object-cover"
                  />
                </div>

                <div
                  className={cn(
                    'md:col-span-5 md:row-start-1',
                    flip ? 'md:col-start-1' : 'md:col-start-8'
                  )}
                >
                  <p className="label text-graphite">
                    <span className="text-ink">No. {project.index}</span>
                    {meta.map((m) => (
                      <span key={m}>
                        <span aria-hidden="true"> · </span>
                        {m}
                      </span>
                    ))}
                  </p>
                  <h3 className="display mt-4 text-step-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="decoration-accent decoration-1 underline-offset-[0.15em] after:absolute after:inset-0 after:content-[''] group-hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <InkRule seed={40 + i} className="mt-5 w-24 text-ink" />
                  <p className="mt-5 max-w-measure">{project.tagline}</p>

                  {project.highlights.length ? (
                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                      {project.highlights.map((h, j) => (
                        <div key={h.label} className="flex flex-col-reverse gap-2">
                          <dt className="label text-step--2 text-graphite">{h.label}</dt>
                          <dd className="font-display text-step-3 leading-none">
                            <Underlined seed={50 + i * 3 + j}>{h.value}</Underlined>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {project.award ? (
                    <p className="hand mt-6">→ {project.award.split(',')[0]}</p>
                  ) : null}

                  <p aria-hidden="true" className="label mt-6 text-ink">
                    Read the entry <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
