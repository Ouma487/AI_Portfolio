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
  /** Bottom line, e.g. the tagline. */
  footer: string;
};

// The journal palette (light theme), as hex because Satori has no CSS variables.
const PAPER = '#E6E7DC';
const INK = '#1B2331';
const GRAPHITE = '#555B5E';
const ACCENT = '#8A2D33';

/** A typographic journal page shared by the site and project OG images. */
export async function renderOg({ kicker, title, footer }: OgProps) {
  const glyphs = `${kicker}${title}${footer}${personalData.name}0123456789—·/`;
  const [display, mono] = await Promise.all([
    loadGoogleFont('Libre Caslon Display', 400, glyphs),
    loadGoogleFont('IBM Plex Mono', 400, glyphs.toUpperCase()),
  ]);
  const fonts = [
    display && { name: 'Caslon', data: display, weight: 400 as const, style: 'normal' as const },
    mono && { name: 'Plex Mono', data: mono, weight: 400 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400; style: 'normal' }[];

  const titleSize = title.length > 28 ? 92 : 128;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          color: INK,
          padding: '56px 64px',
          fontFamily: 'Caslon',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: `1.5px solid ${INK}`,
            paddingBottom: 16,
            fontFamily: 'Plex Mono',
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: GRAPHITE,
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
            lineHeight: 1.02,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: `1.5px solid ${ACCENT}`,
            paddingTop: 16,
            fontFamily: 'Caslon',
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          {footer}
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined }
  );
}
