import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, La_Belle_Aurore, Libre_Caslon_Display, Libre_Caslon_Text } from 'next/font/google';
import './globals.css';

import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { personalData, siteMetadata } from '@/lib/data';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

/* Display: Libre Caslon Display, the high-contrast cut of Caslon drawn for
   large sizes. Sharp serifs and thin hairlines give headings presence
   without weight. */
const display = Libre_Caslon_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

/* Text: Libre Caslon Text, the same family cut for reading: a larger
   x-height and sturdier hairlines than the display cut. A real book face, so
   long case studies read like a journal, not like a web app. */
const text = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
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
    { media: '(prefers-color-scheme: light)', color: '#E6E7DC' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1915' },
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
