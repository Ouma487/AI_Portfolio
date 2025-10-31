import type { Metadata } from 'next';
import './globals.css';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter, Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'AI Engineer Portfolio',
  description:
    'Portfolio of an AI Engineer showcasing projects, experience, and skills.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={cn(
          'antialiased bg-background text-foreground font-body',
          inter.variable,
          poppins.variable
        )}
      >
        {/* ✅ Header appears on all pages */}
        <Header />

        <main className="flex-grow">{children}</main>

        {/* ✅ Footer also appears on all pages */}
        <Footer />

        <Toaster />
      </body>
    </html>
  );
}
