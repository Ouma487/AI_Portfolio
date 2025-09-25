import React from 'react';
import { personalData } from '@/lib/data';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {personalData.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {personalData.contact.social.map((social) => (
            <Button key={social.name} variant="ghost" size="icon" asChild>
              <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                <social.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
