import { personalData } from '@/lib/data';
import { ogSize, renderOg } from '@/lib/og';

export const alt = `${personalData.name}, ${personalData.title}`;
export const size = ogSize;
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [first, ...rest] = personalData.title.split(' ');
  return renderOg({
    kicker: `Based in ${personalData.location}`,
    title: first,
    outlined: rest.join(' '),
    footer: personalData.headline,
  });
}
