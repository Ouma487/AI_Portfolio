import { ImageResponse } from 'next/og';
import { personalData } from '@/lib/data';
import { palette } from '@/lib/palette';

export const ogSize = { width: 1200, height: 630 };

/**
 * Fetch a font file from Google Fonts for the OG renderer (Satori needs raw
 * TTF/OTF data; next/font's CSS can't be used here). `axes` is the css2 axis
 * spec, e.g. "wdth,wght@110,500" asks for one static instance of a variable
 * font. Passing `text` asks Google for a subset containing only those
 * glyphs, so the download is tiny. Runs at build time because the images are
 * statically generated. If the network fails we fall back to the built-in
 * font rather than failing the build.
 */
async function loadGoogleFont(family: string, axes: string, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:${axes}&text=${encodeURIComponent(text)}`;
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

// Satori has no CSS variables, so the OG card reads the same palette as the
// page from src/lib/palette.ts (light theme).
const { paper, ink, graphite, accent, sketch } = palette.light;

/** A typographic title page shared by the site and project OG images. */
export async function renderOg({ kicker, title, footer }: OgProps) {
  const glyphs = `${kicker}${title}${footer}${personalData.name}0123456789—·/`;
  const [display, text, mono] = await Promise.all([
    loadGoogleFont('Archivo', 'wdth,wght@110,500', glyphs),
    loadGoogleFont('Instrument Sans', 'wght@400', glyphs),
    loadGoogleFont('IBM Plex Mono', 'wght@400', glyphs.toUpperCase()),
  ]);
  type Font = { name: string; data: ArrayBuffer; weight: 400 | 500; style: 'normal' };
  const fonts = [
    display && { name: 'Display', data: display, weight: 500, style: 'normal' },
    text && { name: 'Text', data: text, weight: 400, style: 'normal' },
    mono && { name: 'Mono', data: mono, weight: 400, style: 'normal' },
  ].filter(Boolean) as Font[];

  const titleSize = title.length > 28 ? 76 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: paper,
          color: ink,
          padding: '56px 64px',
          fontFamily: 'Text',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: `1.5px solid ${ink}`,
            paddingBottom: 16,
            fontFamily: 'Mono',
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: graphite,
          }}
        >
          <span>{personalData.name}</span>
          <span>{kicker}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontFamily: 'Display',
            fontWeight: 500,
            fontSize: titleSize,
            lineHeight: 1.04,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* A short rose tick over a steel hairline: the one accent. */}
          <div style={{ display: 'flex', height: 2, background: sketch }}>
            <div style={{ width: 96, height: 2, background: accent }} />
          </div>
          <div
            style={{
              display: 'flex',
              paddingTop: 16,
              fontSize: 30,
              lineHeight: 1.35,
              color: ink,
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined }
  );
}
