'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { personalData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  
  { name: 'Skills', href: '#skills' },
  {name: 'Experience', href: '#experience'},
  { name: 'About Me', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact Me', href: '#contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 font-sora',
        isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={personalData.logo.src}
            alt="Portfolio Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-lg font-bold tracking-[0.02em]">Portfolio</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-medium text-[16px] leading-[24px] tracking-[0.02em] text-foreground/80 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Resume Button */}
        <div className="hidden md:flex items-center">
          <Button
            asChild
            className="bg-black text-white hover:bg-gray-900 flex items-center gap-2"
          >
            <a href={personalData.resumeUrl} download>
              Resume
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t font-sora">
          <nav className="flex flex-col items-center gap-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="w-full text-center font-medium text-[16px] leading-[24px] tracking-[0.02em] text-foreground/80 transition-colors hover:text-primary py-2"
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              <a href={personalData.resumeUrl} download>
                Resume
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
