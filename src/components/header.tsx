'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { personalData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 font-body',
        isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {personalData.name}
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
             <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <a href={personalData.resumeUrl} target="_blank" rel="noopener noreferrer">
                    Resume
                </a>
            </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
            <nav className="flex flex-col items-center gap-4 p-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="w-full text-center font-medium text-foreground/80 transition-colors hover:text-primary py-2"
                    >
                        {link.name}
                    </Link>
                ))}
                 <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <a href={personalData.resumeUrl} target="_blank" rel="noopener noreferrer">
                        Resume
                    </a>
                </Button>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
