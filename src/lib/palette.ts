/**
 * The palette as plain hex values, for the places that cannot read CSS
 * custom properties: the Open Graph image renderer (Satori) and the
 * `theme-color` meta tag in the root layout.
 *
 * The page itself reads the same values from the tokens at the top of
 * src/app/globals.css. To change the palette, edit BOTH lists (they are
 * mirrors, kept side by side on purpose so a swap is two small edits):
 *   1. :root and the two dark-mode blocks in src/app/globals.css
 *   2. this file
 *
 * Current values: "Steel & Rose", cool steel neutrals with one dusty-rose
 * signal colour. Contrast ratios are in docs/notes/frontend.md, section 12.
 */
export type Palette = {
  /** Page background. */
  paper: string;
  /** Figure plates: a step darker (light) or lighter (dark) than paper. */
  paperDeep: string;
  /** Photo mounts. */
  mat: string;
  /** Body text and strong strokes. */
  ink: string;
  /** Secondary text: dates, metadata. */
  graphite: string;
  /** The single signal colour: active nav, link underlines, focus, notes, timeline markers. */
  accent: string;
  /** Construction lines and ticks in drawings only. Never used for text. */
  sketch: string;
};

export const palette: { light: Palette; dark: Palette } = {
  light: {
    paper: '#F1F2F4',
    paperDeep: '#E6E8EC',
    mat: '#F7F8F9',
    ink: '#121418',
    graphite: '#5A606B',
    accent: '#9E3D5B',
    sketch: '#B7BCC6',
  },
  dark: {
    paper: '#101216',
    paperDeep: '#191C22',
    mat: '#1F232A',
    ink: '#E9EAEE',
    graphite: '#9AA0AB',
    accent: '#E58BA6',
    sketch: '#4A505C',
  },
};
