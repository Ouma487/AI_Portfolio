import { education, experience, type Education, type Experience } from '@/lib/data';
import { ink } from '@/lib/rough';
import { decimalYear, splitPeriod } from '@/lib/site';
import { Strokes } from '@/components/ink';
import InkDraw from '@/components/ink-draw';

/**
 * Fig. 2: the career as a hand-drawn timeline. Time runs left to right on one
 * ink axis with a tick per year; study sits above the axis, work below it,
 * and each period is a hatched bar whose ends are its real start and end
 * months. The current role has no right edge: it runs on to "now" and ends
 * in an arrowhead.
 *
 * Dates become x positions with a linear scale:
 *   x = X0 + (t - tStart) / (tNow - tStart) * (XNOW - X0)
 * where t is a date as a decimal year (May 2024 = 2024.333). "Now" is the
 * build date, so the drawing grows by itself with every deploy.
 *
 * Below `lg` the same periods become a vertical list (rail on the left,
 * entries on the right), which also serves screen readers on desktop.
 */

/** Periods that started before this are left out (the CPGE years). */
const FROM = 2021;

type Span = {
  key: string;
  name: string;
  /** Short role for the drawing: "AI degree", "intern", "AI engineer". */
  short: string;
  /** Full role or degree, for the list. */
  detail: string;
  period: string;
  start: number;
  /** Undefined while ongoing. */
  end?: number;
  lane: 'study' | 'work';
};

function shortRole(job: Experience): string {
  if (job.employmentType === 'Internship') return 'intern';
  // "AI Engineer / Data Scientist" -> "AI engineer": keep acronyms, lower the rest.
  return job.role
    .split('/')[0]
    .trim()
    .replace(/\b([A-Z])([a-z]+)\b/g, (_, a: string, b: string) => a.toLowerCase() + b);
}

function shortDegree(entry: Education): string {
  if (/artificial intelligence|\bAI\b/i.test(entry.degree)) return 'AI degree';
  return entry.degree.split(/\s[(–-]/)[0];
}

function spans(): Span[] {
  const study: Span[] = education.flatMap((e) => {
    const [from, to] = splitPeriod(e.period);
    const start = decimalYear(from);
    if (start === undefined || start < FROM) return [];
    return [
      {
        key: e.institution,
        name: e.institution,
        short: shortDegree(e),
        detail: e.degree,
        period: e.period,
        start,
        end: decimalYear(to, true),
        lane: 'study' as const,
      },
    ];
  });
  const work: Span[] = experience.flatMap((j) => {
    const start = decimalYear(j.start);
    if (start === undefined || start < FROM) return [];
    return [
      {
        key: `${j.company}-${j.start}`,
        name: j.company,
        short: shortRole(j),
        detail: j.role,
        period: j.period,
        start,
        end: decimalYear(j.end, true),
        lane: 'work' as const,
      },
    ];
  });
  return [...study, ...work].sort((a, b) => a.start - b.start);
}

/* ---- Geometry (viewBox units) ------------------------------------------ */

const W = 900;
const X0 = 30; // x of the first January
const XNOW = 826; // x of today
const BAR = 9; // bar thickness
const BLOCK = 36; // height of one two-line label
const NAME_SIZE = 15;
const META_SIZE = 11;
const GAP = 14; // minimum space between two labels on the same row

/** Rough text widths for collision checks (Archivo at 110%, Plex Mono). */
const nameWidth = (s: string) => s.length * NAME_SIZE * 0.6;
const metaWidth = (s: string) => s.length * META_SIZE * 0.6;

type Placed = Span & {
  x0: number;
  x1: number;
  meta: string;
  /** Estimated centre of the label (for collisions), inside the plate. */
  cx: number;
  width: number;
  /** Where the text is anchored, and how; also where a leader line runs. */
  tx: number;
  anchor: 'middle' | 'start';
  /** 0 = next to the bar; 1, 2 = further out, joined by a leader line. */
  depth: number;
};

/**
 * Put each label centred on its bar, on the row nearest the axis where it
 * fits. A label pushed further out gets a leader line, and that line may not
 * cut through a label on a nearer row either.
 */
function placeLabels(items: Omit<Placed, 'depth'>[]): Placed[] {
  const rows: { from: number; to: number }[][] = [];
  const overlaps = (row: { from: number; to: number }[] | undefined, from: number, to: number) =>
    (row ?? []).some((r) => from < r.to + GAP && to > r.from - GAP);
  return items.map((item) => {
    const from = item.cx - item.width / 2;
    const to = item.cx + item.width / 2;
    let depth = 0;
    while (
      overlaps(rows[depth], from, to) ||
      rows.slice(0, depth).some((row) => overlaps(row, item.tx, item.tx))
    ) {
      depth += 1;
    }
    (rows[depth] ??= []).push({ from, to });
    return { ...item, depth };
  });
}

function Plate({ all, now }: { all: Span[]; now: number }) {
  const tStart = Math.floor(Math.min(...all.map((s) => s.start)));
  const x = (t: number) => X0 + ((t - tStart) / (now - tStart)) * (XNOW - X0);

  const layout = (lane: Span['lane']) =>
    placeLabels(
      all
        .filter((s) => s.lane === lane)
        .map((s) => {
          const x0 = x(s.start);
          const x1 = x(s.end ?? now);
          const meta = (s.end === undefined ? `${s.short} · now` : s.short).toUpperCase();
          const width = Math.max(nameWidth(s.name), metaWidth(meta));
          // An ongoing period has no end to centre on: its label starts where
          // the period starts, and runs on towards "now" like the bar.
          if (s.end === undefined && x0 + width < W - 4) {
            return { ...s, x0, x1, meta, width, cx: x0 + width / 2, tx: x0, anchor: 'start' as const };
          }
          const cx = Math.min(Math.max((x0 + x1) / 2, width / 2 + 4), W - width / 2 - 4);
          return { ...s, x0, x1, meta, width, cx, tx: cx, anchor: 'middle' as const };
        })
    );
  const study = layout('study');
  const work = layout('work');
  const rowsAbove = Math.max(1, ...study.map((s) => s.depth + 1));
  const rowsBelow = Math.max(1, ...work.map((s) => s.depth + 1));

  // Vertical rhythm, top to bottom.
  const studyTop = 6 + rowsAbove * BLOCK + 4;
  const yearY = studyTop + BAR + 22;
  const AX = yearY + 11;
  const workTop = AX + 11;
  const H = workTop + BAR + 10 + rowsBelow * BLOCK + 6;

  const barTop = (s: Placed) => (s.lane === 'study' ? studyTop : workTop);
  // Baseline of a label's first line; study labels stack upwards.
  const labelY = (s: Placed) =>
    s.lane === 'study'
      ? studyTop - 22 - s.depth * BLOCK
      : workTop + BAR + 24 + s.depth * BLOCK;

  const years = Array.from({ length: Math.floor(now) - tStart + 1 }, (_, i) => tStart + i);
  const axis = ink.line([X0 - 14, AX], [XNOW + 40, AX], 3, { roughness: 0.6, bowing: 0.3 });
  const axisHead = ink.polyline(
    [
      [XNOW + 32, AX - 5],
      [XNOW + 41, AX],
      [XNOW + 32, AX + 5],
    ],
    4,
    { roughness: 0.3 }
  );
  const ticks = years.flatMap((y, i) =>
    ink.line([x(y), AX - 5], [x(y), AX + 5], 10 + i, { roughness: 0.3, disableMultiStroke: true })
  );

  // One marginal note, in the empty top-right corner once study is over:
  // where the work has been heading.
  const lastStudyEnd = Math.max(...study.map((s) => s.x1), X0);
  const note = lastStudyEnd < XNOW - 160 ? { x: XNOW + 36, y: studyTop + BAR } : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="fig2-title"
      className="h-auto w-full overflow-visible font-mono"
    >
      <title id="fig2-title">
        {`Timeline from ${tStart} to now: ${all
          .map((s) => `${s.name}, ${s.short}, ${s.period}`)
          .join('; ')}.`}
      </title>

      {/* The axis and the years, in ink and graphite. */}
      <g className="text-ink">
        <Strokes d={[...axis, ...axisHead]} width={1.2} className="draw" />
      </g>
      <g className="text-graphite">
        <Strokes d={ticks} width={1} />
      </g>
      <g fill="currentColor" className="text-graphite" fontSize={11} letterSpacing="0.04em">
        {years.map((y) => (
          <text key={y} x={x(y)} y={yearY} textAnchor="middle">
            {y}
          </text>
        ))}
      </g>

      {[...study, ...work].map((s, i) => {
        const top = barTop(s);
        const ongoing = s.end === undefined;
        const end = ongoing ? s.x1 - 2 : s.x1;
        // Closed box for a finished period; open on the right while ongoing.
        const outline = ink.polyline(
          ongoing
            ? [
                [end, top],
                [s.x0, top],
                [s.x0, top + BAR],
                [end, top + BAR],
              ]
            : [
                [s.x0, top],
                [end, top],
                [end, top + BAR],
                [s.x0, top + BAR],
                [s.x0, top],
              ],
          30 + i,
          { roughness: 0.5 }
        );
        const hatch = ink.hatch(s.x0, top, end - s.x0, BAR, 40 + i);
        const head = ongoing
          ? ink.polyline(
              [
                [end + 3, top - 1],
                [end + 10, top + BAR / 2],
                [end + 3, top + BAR + 1],
              ],
              50 + i,
              { roughness: 0.3 }
            )
          : [];
        // Leader from the bar to a label pushed onto a further row.
        const y = labelY(s);
        const leader =
          s.depth > 0
            ? s.lane === 'work'
              ? ink.line([s.tx, top + BAR + 3], [s.tx, y - NAME_SIZE], 70 + i, { roughness: 0.3 })
              : ink.line([s.tx, top - 3], [s.tx, y + META_SIZE + 6], 70 + i, { roughness: 0.3 })
            : [];
        return (
          <g key={s.key}>
            <g className={ongoing ? 'text-accent' : 'text-graphite'}>
              <Strokes d={hatch} width={0.8} className="draw draw-late" />
            </g>
            <g className={ongoing ? 'text-accent' : 'text-ink'}>
              <Strokes d={[...outline, ...head]} width={1.2} className="draw" />
            </g>
            <g className="text-graphite">
              <Strokes d={leader} width={0.8} />
            </g>
            <text
              x={s.tx}
              y={y}
              textAnchor={s.anchor}
              fontSize={NAME_SIZE}
              className="fill-ink font-display font-medium"
            >
              {s.name}
            </text>
            <text
              x={s.tx}
              y={y + 15}
              textAnchor={s.anchor}
              fontSize={META_SIZE}
              letterSpacing="0.06em"
              className={ongoing ? 'fill-accent' : 'fill-graphite'}
            >
              {s.meta}
            </text>
          </g>
        );
      })}

      {note ? (
        <text
          x={note.x}
          y={note.y}
          textAnchor="end"
          fontSize={21}
          className="fill-accent font-hand"
        >
          → into production
        </text>
      ) : null}
    </svg>
  );
}

export default function Timeline() {
  const all = spans();
  const today = new Date();
  const now = today.getFullYear() + (today.getMonth() + today.getDate() / 31) / 12;
  const rail = ink.line([4, 0], [4, 100], 3, { roughness: 0.6, disableMultiStroke: true });
  const arrowDown = ink.polyline(
    [
      [1, 1],
      [6, 7],
      [11, 1],
    ],
    5,
    { roughness: 0.3 }
  );

  return (
    <figure className="plate border-y border-ink/15">
      <InkDraw className="hidden px-6 py-8 lg:block">
        <Plate all={all} now={now} />
      </InkDraw>

      {/* Below lg: the same periods as a vertical timeline, oldest first.
          On desktop it stays available to screen readers. */}
      <ol className="relative px-4 py-6 lg:sr-only">
        {all.map((s, i) => {
          const ongoing = s.end === undefined;
          const last = i === all.length - 1;
          return (
            <li key={s.key} className="relative grid grid-cols-[1.75rem_1fr] gap-x-3">
              <div className="flex justify-center pt-1.5">
                <span
                  aria-hidden="true"
                  className={
                    'block h-3 w-3 shrink-0 rounded-full border-[1.5px] ' +
                    (ongoing ? 'border-accent bg-accent' : 'border-ink bg-paper-deep')
                  }
                />
                {!last || ongoing ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 8 100"
                    preserveAspectRatio="none"
                    className={
                      'absolute left-[calc(0.875rem-4px)] top-6 w-2 ' +
                      (last ? 'h-[calc(100%-1.75rem)] text-accent' : 'h-[calc(100%-1.25rem)] text-ink/60')
                    }
                  >
                    <Strokes d={rail} width={1.2} />
                  </svg>
                ) : null}
                {last && ongoing ? (
                  // Open end: the rail runs on past the last entry, into an arrowhead.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 8"
                    className="absolute bottom-0 left-[calc(0.875rem-6px)] h-2 w-3 overflow-visible text-accent"
                  >
                    <Strokes d={arrowDown} width={1.2} />
                  </svg>
                ) : null}
              </div>
              <div className="pb-8">
                <p className="label text-step--2 tabular-nums text-graphite">
                  {ongoing ? (
                    <>
                      {splitPeriod(s.period)[0]} – <span className="text-accent">now</span>
                    </>
                  ) : (
                    s.period
                  )}
                </p>
                <p className="display mt-1 text-step-1 leading-tight">{s.name}</p>
                <p className="mt-0.5 text-step--1 text-graphite">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
