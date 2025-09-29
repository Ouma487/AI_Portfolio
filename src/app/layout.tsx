import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter, Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'AI Engineer Portfolio',
  description: 'Portfolio of an AI Engineer showcasing projects, experience, and skills.',
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
      <body className={cn('antialiased', inter.variable, poppins.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
