import { getProjectBySlug, projects } from '@/lib/data';
import { ogSize, renderOg } from '@/lib/og';

export const alt = 'Project case study';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return renderOg({
    kicker: `Field notes · Entry No. ${project?.index ?? ''}`,
    title: project?.title ?? 'Project',
    footer: project?.tagline ?? '',
  });
}
