import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectBySlug, personalData, projects } from '@/lib/data';
import ExternalLink from '@/components/external-link';
import { Circled, InkRule } from '@/components/ink';

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
  const url = `/projects/${project.slug}`;
  // The Open Graph image comes from ./opengraph-image.tsx in this folder.
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${project.title} · ${personalData.name}`,
      description: project.summary,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · ${personalData.name}`,
      description: project.tagline,
    },
  };
}

function Meta({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink/25 pt-3">
      <dt className="label text-step--2 text-graphite">{term}</dt>
      <dd className="mt-2 leading-snug">{children}</dd>
    </div>
  );
}

/** A lettered part of the entry: the letter in the margin, the text beside it. */
function Chapter({
  letter,
  title,
  children,
}: {
  letter: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`chapter-${letter}`} className="reveal grid-12 gap-y-4">
      <h2 id={`chapter-${letter}`} className="md:col-span-3">
        <span className="font-display text-step-3 italic text-graphite">{letter}.</span>{' '}
        <span className="caps">{title}</span>
      </h2>
      <div className="md:col-span-8 md:col-start-4">{children}</div>
    </section>
  );
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const position = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(position - 1 + projects.length) % projects.length];
  const next = projects[(position + 1) % projects.length];
  const seed = position * 17 + 3;

  return (
    <article className="frame pb-section pt-8 md:pt-12">
      {/* Breadcrumb, set as the running head of the page. */}
      <nav aria-label="Breadcrumb" className="label text-graphite">
        <ol className="flex flex-wrap items-center gap-x-3">
          <li>
            <Link href="/" className="hit link">
              Field notes
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#projects" className="hit link">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="tabular-nums text-ink">
            No. {project.index} of {String(projects.length).padStart(2, '0')}
          </li>
        </ol>
      </nav>
      <InkRule seed={seed} className="mt-2 text-ink" />

      {/* Title block */}
      <header className="grid-12 gap-y-6 pt-12 md:pt-20">
        <p className="caps text-graphite md:col-span-3 md:pt-4">
          Entry <span className="text-ink">No. {project.index}</span>
        </p>
        <div className="md:col-span-9">
          <h1 className="display text-[clamp(2.5rem,1.2rem+4.4vw,5.5rem)] leading-[1.02] [overflow-wrap:anywhere] lg:max-w-[16ch]">
            {project.title}
          </h1>
          <p className="mt-8 max-w-[36ch] text-step-2 italic leading-snug text-graphite">
            {project.tagline}
          </p>
        </div>
      </header>

      {/* Meta row */}
      <dl className="mt-16 grid grid-cols-2 gap-x-gutter gap-y-6 md:grid-cols-12">
        <div className="md:col-span-2">
          <Meta term="Dated">{project.period ?? project.year ?? '—'}</Meta>
        </div>
        <div className="md:col-span-3">
          <Meta term="Partner">{project.partner ?? '—'}</Meta>
        </div>
        <div className="col-span-2 md:col-span-3">
          <Meta term="Recognition">{project.award ?? '—'}</Meta>
        </div>
        <div className="col-span-2 md:col-span-4">
          <Meta term="Stack">
            <span className="font-mono text-step--1">{project.stack.join(' / ')}</span>
          </Meta>
        </div>
      </dl>

      {/* Cover, mounted like a photograph. */}
      <div className="mounted mt-16 lg:mx-auto lg:w-10/12">
        <Image
          src={project.image.src}
          alt={project.imageAlt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1440px) 1300px, calc(100vw - 2rem)"
          priority
          className="h-auto max-h-[70vh] w-full object-cover"
        />
      </div>

      {/* Summary as the lead, with the measured figures circled beside it. */}
      <div className="grid-12 mt-20 gap-y-12">
        <p className="reveal text-step-2 leading-snug md:col-span-7 md:col-start-4">
          {project.summary}
        </p>
        {project.highlights.length ? (
          <ul className="reveal flex flex-wrap gap-x-12 gap-y-8 md:col-span-2 md:col-start-11 md:flex-col">
            {project.highlights.map((h, i) => (
              <li key={h.label}>
                <p className="font-display text-step-5 leading-none">
                  <Circled seed={seed + i * 5}>{h.value}</Circled>
                </p>
                <p className="label mt-4 text-step--2 text-graphite">{h.label}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-20 space-y-16">
        <Chapter letter="A" title="Context">
          <p className="max-w-measure">{project.context}</p>
        </Chapter>

        <Chapter letter="B" title="Approach">
          <ol className="max-w-measure">
            {project.approach.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.5rem_1fr] border-b border-ink/15 py-3 first:pt-0">
                <span aria-hidden="true" className="font-mono text-step--1 tabular-nums text-graphite">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter letter="C" title="Results">
          <ul className="max-w-measure space-y-3">
            {project.results.map((result) => (
              <li key={result} className="grid grid-cols-[2.5rem_1fr]">
                <span aria-hidden="true" className="text-accent">→</span>
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </Chapter>

        {project.links.length ? (
          <Chapter letter="D" title="Links">
            <ul className="flex flex-wrap gap-4">
              {project.links.map((link) => (
                <li key={link.href}>
                  <ExternalLink
                    href={link.href}
                    className="label inline-flex min-h-12 items-center gap-3 border border-ink/60 px-5 transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {link.kind === 'github' ? 'Source on GitHub' : link.label}
                    <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </Chapter>
        ) : null}
      </div>

      {/* Previous / next */}
      <nav aria-label="More projects" className="mt-section">
        <InkRule seed={seed + 1} strong className="text-ink" />
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            className="group block border-b border-ink/20 py-8 md:border-b-0 md:border-r md:pr-gutter"
          >
            <span className="label text-graphite">
              <span aria-hidden="true">← </span>Previous entry · No. {prev.index}
            </span>
            <span className="display mt-3 block text-step-3 decoration-accent decoration-1 underline-offset-[0.15em] group-hover:underline">
              {prev.title}
            </span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="group block py-8 text-right md:pl-gutter">
            <span className="label text-graphite">
              Next entry · No. {next.index}
              <span aria-hidden="true"> →</span>
            </span>
            <span className="display mt-3 block text-step-3 decoration-accent decoration-1 underline-offset-[0.15em] group-hover:underline">
              {next.title}
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
};

export default ProjectPage;
