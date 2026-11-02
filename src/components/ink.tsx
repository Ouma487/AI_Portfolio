import { ink } from '@/lib/rough';
import { cn } from '@/lib/utils';

/**
 * Small server components for hand-drawn ink marks. All shapes come from
 * rough.js with a fixed seed (see src/lib/rough.ts), so they are rendered once
 * at build time and look identical on every visit.
 */

/** Render rough.js path data as SVG paths drawn in the current colour. */
export function Strokes({
  d,
  className,
  width = 1,
}: {
  d: string[];
  className?: string;
  width?: number;
}) {
  return (
    <>
      {d.map((path, i) => (
        <path
          key={i}
          d={path}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={className}
        />
      ))}
    </>
  );
}

/**
 * A pen-drawn horizontal rule. The SVG stretches to the container width
 * (`preserveAspectRatio="none"`) while `non-scaling-stroke` keeps the line
 * weight constant, so one drawing works at any width.
 */
export function InkRule({
  seed,
  className,
  strong = false,
}: {
  seed: number;
  className?: string;
  /** Doubled stroke for section openings; single for subdivisions. */
  strong?: boolean;
}) {
  const d = ink.line([2, 4], [998, 4], seed, {
    roughness: 0.7,
    bowing: 0.4,
    disableMultiStroke: !strong,
  });
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 8"
      preserveAspectRatio="none"
      className={cn('block h-2 w-full overflow-visible', className)}
    >
      <Strokes d={d} width={strong ? 1.1 : 0.9} />
    </svg>
  );
}

/** A loose ink ellipse around a number, like a figure circled in a notebook. */
export function Circled({
  children,
  seed,
  className,
}: {
  children: React.ReactNode;
  seed: number;
  className?: string;
}) {
  const d = ink.ellipse(50, 25, 94, 44, seed, { roughness: 1.1, bowing: 1 });
  return (
    <span className={cn('relative inline-block px-[0.35em] py-[0.1em]', className)}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -left-[0.12em] -top-[0.18em] h-[calc(100%+0.36em)] w-[calc(100%+0.24em)] overflow-visible text-accent"
      >
        <Strokes d={d} width={1.4} />
      </svg>
    </span>
  );
}

/** A quick pen underline under a word or number. */
export function Underlined({
  children,
  seed,
  className,
}: {
  children: React.ReactNode;
  seed: number;
  className?: string;
}) {
  const d = ink.curve(
    [
      [1, 6],
      [40, 4.5],
      [99, 3],
    ],
    seed,
    { roughness: 0.8 }
  );
  return (
    <span className={cn('relative inline-block', className)}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.3em] w-full overflow-visible text-accent"
      >
        <Strokes d={d} width={1.6} />
      </svg>
    </span>
  );
}
