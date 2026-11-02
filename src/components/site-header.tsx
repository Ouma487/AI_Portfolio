'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, personalData } from '@/lib/data';
import { homeHref } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Watch every section listed in `navigation` and report the one currently
 * crossing a thin band around 40% of the viewport height. Returns '' when no
 * section is in that band (e.g. while the hero is on screen).
 */
function useActiveSection(enabled: boolean): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return;
    }
    const sections = navigation
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    // Shrink the observed "viewport" to a band from 40% to 45% of the screen
    // height: a section is active while any part of it overlaps that band.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? '' : current));
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu on route change (e.g. tapping a link to another page).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: Escape closes it, focus moves into it and
  // stays inside it, and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Trap focus: the toggle button and the panel links form one loop.
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <div className="frame flex h-header items-center justify-between gap-6">
        <Link
          href="/"
          className="hit gap-3 font-display text-step-0 font-bold tracking-tight"
          aria-label={`${personalData.name}, home`}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center bg-ink font-mono text-[0.6875rem] font-bold text-paper"
          >
            {personalData.initials}
          </span>
          <span className="hidden sm:inline">{personalData.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item, i) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <Link
                    href={homeHref(item.href)}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'label hit group gap-1.5 px-2.5 text-mute transition-colors duration-200 hover:text-ink',
                      isActive && 'text-ink'
                    )}
                  >
                    <span className="text-step--2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={cn(
                        'border-b border-transparent pb-px transition-colors duration-200 group-hover:border-ink',
                        isActive && 'border-ink'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={personalData.resumeUrl}
            download
            className="label hit hidden gap-2 border border-ink px-4 transition-colors duration-200 hover:bg-ink hover:text-paper sm:inline-flex"
          >
            Résumé <span aria-hidden="true">↓</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="label hit min-w-11 justify-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-5">
              <span
                className={cn(
                  'absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300',
                  open && 'translate-y-[5px] rotate-45'
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300',
                  open && '-translate-y-[4px] -rotate-45'
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-header overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="frame flex min-h-full flex-col pb-10 pt-6">
          <ul className="border-t border-ink">
            {navigation.map((item, i) => (
              <li key={item.href} className="border-b border-ink">
                <Link
                  href={homeHref(item.href)}
                  onClick={() => close(false)}
                  className="flex min-h-11 items-baseline gap-4 py-4"
                >
                  <span className="label text-mute tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-step-4">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={personalData.resumeUrl}
            download
            className="label mt-8 inline-flex min-h-11 items-center justify-between border border-ink px-4"
          >
            Download résumé <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
