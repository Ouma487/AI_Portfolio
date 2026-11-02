import { ImageResponse } from 'next/og';
import { personalData } from '@/lib/data';

export const ogSize = { width: 1200, height: 630 };

/**
 * Fetch a font file from Google Fonts for the OG renderer (Satori needs raw
 * TTF/OTF data; next/font's CSS can't be used here). Passing `text` asks
 * Google for a subset containing only those glyphs, so the download is tiny.
 * Runs at build time because the images are statically generated. If the
 * network fails we fall back to the built-in font rather than failing the build.
 */
async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

type OgProps = {
  /** Small mono line at the top, e.g. "Case study 01". */
  kicker: string;
  /** The big line. */
  title: string;
  /** Optional outlined word appended to the title. */
  outlined?: string;
  /** Bottom line, e.g. the tagline. */
  footer: string;
};

/** A monochrome, typographic card shared by the site and project OG images. */
export async function renderOg({ kicker, title, outlined, footer }: OgProps) {
  const glyphs = `${kicker}${title}${outlined ?? ''}${footer}${personalData.name}0123456789—·/`;
  const [display, mono] = await Promise.all([
    loadGoogleFont('Archivo', 800, glyphs),
    loadGoogleFont('JetBrains Mono', 500, glyphs),
  ]);
  const fonts = [
    display && { name: 'Archivo', data: display, weight: 800 as const, style: 'normal' as const },
    mono && { name: 'JetBrains Mono', data: mono, weight: 500 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 800 | 500; style: 'normal' }[];

  const titleSize = title.length > 28 ? 84 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          color: '#0a0a0a',
          padding: '56px 64px',
          fontFamily: 'Archivo',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0a0a0a',
            paddingBottom: 16,
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>{personalData.name}</span>
          <span>{kicker}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -4,
          }}
        >
          <span style={{ marginRight: 28 }}>{title}</span>
          {outlined ? (
            <span style={{ color: '#ffffff', WebkitTextStroke: '3px #0a0a0a' }}>{outlined}</span>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: '2px solid #0a0a0a',
            paddingTop: 16,
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            lineHeight: 1.4,
          }}
        >
          {footer}
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined }
  );
}
