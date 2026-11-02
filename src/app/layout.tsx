import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono, Newsreader } from 'next/font/google';
import './globals.css';

import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { personalData, siteMetadata } from '@/lib/data';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

/* Display: Archivo, a grotesk with a width axis. Set heavy and slightly
   expanded it gives the posters-and-magazines voice, and it holds up when
   outlined. */
const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

/* Text: Newsreader, a serif drawn for reading on screens, with an optical
   size axis so small captions and large lead paragraphs both look right. */
const text = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-text',
  display: 'swap',
});

/* Mono: JetBrains Mono for labels, indices, dates and figures, the
   "lab notebook" layer of the page. */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(display.variable, text.variable, mono.variable)}>
      <body>
        <a
          href="#main"
          className="label sr-only z-[60] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
