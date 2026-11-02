import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Instrument_Sans, La_Belle_Aurore } from 'next/font/google';
import './globals.css';

import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { personalData, siteMetadata } from '@/lib/data';
import { palette } from '@/lib/palette';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

/* Display: Archivo, a grotesque with a width axis (62% to 125%). Set at
   110% (globals.css, .display) it gains the slightly extended, engineered
   look of early-2000s hardware branding without turning into a sci-fi face.
   Variable, so one file covers every weight and width. */
const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

/* Text: Instrument Sans, a contemporary grotesque with open apertures, a
   true italic and calm, slightly narrow proportions that read well at 17 to
   18px. Variable weight. */
const text = Instrument_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-text',
  display: 'swap',
});

/* Mono: IBM Plex Mono for dates, indices and figures: the lab-notebook layer. */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/* Hand: La Belle Aurore, a fine-nibbed, grown-up hand. Marginal notes only. */
const hand = La_Belle_Aurore({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteMetadata.title,
    template: `%s · ${personalData.name}`,
  },
  description: siteMetadata.description,
  authors: [{ name: personalData.name }],
  creator: personalData.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: personalData.name,
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: palette.light.paper },
    { media: '(prefers-color-scheme: dark)', color: palette.dark.paper },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(display.variable, text.variable, mono.variable, hand.variable)}>
      <body>
        {/* Without JavaScript the sketches never get the "drawn" signal from
            <InkDraw>, so show their strokes straight away. */}
        <noscript>
          <style>{`[data-ink] .draw { stroke-dashoffset: 0 !important; }`}</style>
        </noscript>
        <a
          href="#main"
          className="label sr-only z-[80] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
