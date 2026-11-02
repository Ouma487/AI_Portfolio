import { personalData } from '@/lib/data';
import { ogSize, renderOg } from '@/lib/og';

export const alt = `${personalData.name}, ${personalData.title}`;
export const size = ogSize;
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return renderOg({
    kicker: `Field notes · ${personalData.title}`,
    title: personalData.name,
    footer: personalData.headline,
  });
}
