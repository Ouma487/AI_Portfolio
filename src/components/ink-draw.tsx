'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lets the ink sketches inside it "draw themselves" once, the first time they
 * scroll into view. The animation itself is CSS (globals.css, `.ink-draw`):
 * this component only flips `data-ink` from "pending" to "drawn".
 *
 * - Reduced motion: the CSS only hides the strokes under
 *   `prefers-reduced-motion: no-preference`, so the sketch is simply there.
 * - No JavaScript: a <noscript> style in the layout shows the strokes.
 */
export default function InkDraw({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'pending' | 'drawn'>('pending');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('drawn');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-ink={state} className={className}>
      {children}
    </div>
  );
}
