import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectBySlug, personalData, projects } from '@/lib/data';
import ExternalLink from '@/components/external-link';

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
    <div className="border-t border-ink pt-3">
      <dt className="label text-step--2 text-mute">{term}</dt>
      <dd className="mt-2 text-step-0 leading-snug">{children}</dd>
    </div>
  );
}

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
    <section aria-labelledby={`chapter-${letter}`} className="reveal grid-12 gap-y-6 border-t border-ink pt-4">
      <h2 id={`chapter-${letter}`} className="label md:col-span-3">
        <span className="tabular-nums">{letter}</span>
        <span aria-hidden="true"> — </span>
        {title}
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

  return (
    <article className="frame pb-section pt-8 md:pt-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="label border-b border-ink pb-3">
        <ol className="flex flex-wrap items-center gap-x-3">
          <li>
            <Link href="/" className="hit link">
              Index
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#projects" className="hit link">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-mute tabular-nums">
            {project.index} of {String(projects.length).padStart(2, '0')}
          </li>
        </ol>
      </nav>

      {/* Title block */}
      <header className="grid-12 gap-y-8 pt-12 md:pt-20">
        <p aria-hidden="true" className="font-mono text-step-5 font-medium leading-none tracking-tight md:col-span-2">
          {project.index}
        </p>
        <div className="md:col-span-10">
          <h1 className="display text-[clamp(2.25rem,0.9rem+5.6vw,8rem)] leading-[0.92] [overflow-wrap:anywhere] lg:max-w-[12ch]">
            {project.title}
          </h1>
          <p className="mt-8 max-w-[34ch] font-serif text-step-2 italic leading-snug">
            {project.tagline}
          </p>
        </div>
      </header>

      {/* Meta row */}
      <dl className="mt-16 grid grid-cols-2 gap-x-gutter gap-y-6 md:grid-cols-12">
        <div className="md:col-span-2">
          <Meta term="Year">{project.period ?? project.year ?? '—'}</Meta>
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

      {/* Hero image */}
      <figure className="mt-16">
        <Image
          src={project.image.src}
          alt={project.imageAlt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1440px) 1312px, calc(100vw - 2.5rem)"
          priority
          className="mono-img h-auto max-h-[80vh] w-full border border-ink object-cover"
        />
      </figure>

      {/* Highlight figures */}
      {project.highlights.length ? (
        <ul className="mt-16 grid grid-cols-1 border-y border-ink sm:grid-cols-2 lg:grid-cols-3">
          {project.highlights.map((h) => (
            <li key={h.label} className="reveal border-b border-ink py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:pr-6 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-6">
              <p className="font-mono text-display font-medium leading-none tracking-tighter">{h.value}</p>
              <p className="label mt-4 text-mute">{h.label}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Summary as the lead */}
      <div className="grid-12 mt-20">
        <p className="reveal text-step-2 leading-snug md:col-span-8 md:col-start-4">{project.summary}</p>
      </div>

      <div className="mt-20 space-y-20">
        <Chapter letter="A" title="Context">
          <p className="max-w-measure text-step-1">{project.context}</p>
        </Chapter>

        <Chapter letter="B" title="Approach">
          <ol className="max-w-measure">
            {project.approach.map((step, i) => (
              <li key={step} className="grid grid-cols-[3rem_1fr] border-b border-ink/20 py-4 first:pt-0">
                <span aria-hidden="true" className="label pt-1 tabular-nums text-mute">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-step-1">{step}</span>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter letter="C" title="Results">
          <ul className="max-w-measure space-y-4">
            {project.results.map((result) => (
              <li key={result} className="grid grid-cols-[3rem_1fr]">
                <span aria-hidden="true" className="font-mono text-step-1">→</span>
                <span className="text-step-1">{result}</span>
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
                    className="label inline-flex min-h-12 items-center gap-3 border border-ink px-5 transition-colors duration-200 hover:bg-ink hover:text-paper"
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
      <nav aria-label="More projects" className="mt-section grid grid-cols-1 border-t border-ink md:grid-cols-2">
        <Link
          href={`/projects/${prev.slug}`}
          className="group block border-b border-ink py-8 md:border-b-0 md:border-r md:pr-gutter"
        >
          <span className="label text-mute">
            <span aria-hidden="true">← </span>Previous · {prev.index}
          </span>
          <span className="display mt-3 block text-step-3 transition-transform duration-500 ease-editorial group-hover:-translate-x-1">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group block py-8 text-right md:pl-gutter"
        >
          <span className="label text-mute">
            Next · {next.index}
            <span aria-hidden="true"> →</span>
          </span>
          <span className="display mt-3 block text-step-3 transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
};

export default ProjectPage;
