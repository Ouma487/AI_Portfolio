import { education, experience } from '@/lib/data';
import { ink } from '@/lib/rough';
import { Strokes } from '@/components/ink';
import InkDraw from '@/components/ink-draw';

/**
 * Fig. 2: the route so far, CentraleSupélec -> Renault -> Libertify -> Kairos,
 * drawn on a sparse, real map of the south-west of Paris.
 *
 * Positions are real coordinates projected with an equirectangular
 * projection around 48.78°N (good enough over 30 km), at 18 px per km, so
 * the distances on the plate are true to scale. Desktop shows the map; below
 * `md` the same stops become a vertical route (an ordered list).
 */

const LAT0 = 48.78;
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LON = 111.32 * Math.cos((LAT0 * Math.PI) / 180);
const SCALE = 18; // px per km
const LON_REF = 2.0;
const project = (lat: number, lon: number): [number, number] => {
  const x = (lon - LON_REF) * KM_PER_DEG_LON;
  const y = (lat - LAT0) * KM_PER_DEG_LAT;
  return [290 + (x - 5.75) * SCALE, 30 + (13.5 - y) * SCALE];
};

/** Where each organisation in data.ts is (presentational, not content). */
const COORDS: Record<string, [number, number]> = {
  CentraleSupélec: [48.7097, 2.1655], // Paris-Saclay campus, Gif-sur-Yvette
  Renault: [48.7768, 2.0784], // Technocentre, Guyancourt
  Libertify: [48.8566, 2.3522], // Paris
  'Kairos Research AI': [48.8566, 2.3522], // Paris
};

type Stop = { name: string; place: string; period: string; at: [number, number] };

function stops(): Stop[] {
  const school = education.find((e) => e.institution in COORDS);
  const jobs = [...experience]
    .filter((e) => e.company in COORDS)
    .sort((a, b) => a.start.localeCompare(b.start));
  const list: Omit<Stop, 'at'>[] = [
    ...(school
      ? [{ name: school.institution, place: school.location ?? '', period: school.period }]
      : []),
    ...jobs.map((j) => ({ name: j.company, place: j.location ?? '', period: j.period })),
  ];
  return list.map((s) => ({
    ...s,
    place: s.place.split(',')[0],
    at: project(...COORDS[s.name]),
  }));
}

/** Two stops in the same city are nudged apart along a diagonal. */
function spread(all: Stop[]): Stop[] {
  const seen = new Map<string, number>();
  return all.map((s) => {
    const key = s.at.join();
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    return n === 0 ? s : { ...s, at: [s.at[0] + 30 * n, s.at[1] - 26 * n] };
  });
}

// Label placement per stop index: anchor and offset from the marker.
const LABELS: { dx: number; dy: number; anchor: 'start' | 'end' }[] = [
  { dx: 18, dy: 0, anchor: 'start' },
  { dx: -18, dy: -4, anchor: 'end' },
  { dx: 4, dy: 32, anchor: 'start' },
  { dx: 18, dy: -12, anchor: 'start' },
];

function RoutePlate({ route }: { route: Stop[] }) {
  const pts = route.map((s) => s.at);
  // Through each stop, with a gentle detour between distant ones.
  const path: [number, number][] = [];
  pts.forEach((p, i) => {
    if (i > 0) {
      const [a, b] = [pts[i - 1], p];
      const mid: [number, number] = [(a[0] + b[0]) / 2 + (i % 2 ? -6 : 4), (a[1] + b[1]) / 2 + (i % 2 ? 4 : -6)];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 60) path.push(mid);
    }
    path.push(p);
  });
  const routeD = ink.curve(path, 5, { roughness: 0.8, strokeWidth: 1.3 });

  const paris = project(48.8566, 2.3522);
  const parisOutline = ink.ellipse(paris[0] - 6, paris[1] - 4, 324, 173, 9, {
    roughness: 1.4,
    bowing: 2,
    disableMultiStroke: true,
  });

  const meridians = [2.1, 2.2, 2.3, 2.4].map((lon) => ({ lon, x: project(LAT0, lon)[0] }));
  const parallels = [48.7, 48.8, 48.9].map((lat) => ({ lat, y: project(lat, LON_REF)[1] }));
  const grid = [
    ...meridians.flatMap((m, i) => ink.line([m.x, 6], [m.x, 444], 60 + i, { roughness: 0.4, disableMultiStroke: true })),
    ...parallels.flatMap((p, i) => ink.line([6, p.y], [874, p.y], 70 + i, { roughness: 0.4, disableMultiStroke: true })),
  ];
  const fiveKm = 5 * SCALE;
  const scaleBar = ink.polyline(
    [
      [760, 410],
      [760, 416],
      [760 + fiveKm, 416],
      [760 + fiveKm, 410],
    ],
    80,
    { roughness: 0.4 }
  );
  const north = [
    ...ink.line([846, 372], [846, 338], 81, { roughness: 0.3 }),
    ...ink.polyline(
      [
        [840, 348],
        [846, 336],
        [852, 348],
      ],
      82,
      { roughness: 0.3 }
    ),
  ];
  // Straight-line distance from the first stop to the last, from the real
  // coordinates (before the same-city markers were nudged apart).
  const [first, last] = [route[0], route[route.length - 1]].map((s) => project(...COORDS[s.name]));
  const crowKm = Math.round(Math.hypot(last[0] - first[0], last[1] - first[1]) / SCALE);

  return (
    <svg
      viewBox="0 0 880 450"
      aria-hidden="true"
      className="h-auto w-full overflow-visible font-mono"
    >
      {/* Construction layer, in pencil. */}
      <g className="text-pencil" opacity={0.55}>
        <Strokes d={grid} width={0.6} />
      </g>
      <g className="text-pencil">
        <Strokes d={parisOutline} width={0.9} />
      </g>
      <g fill="currentColor" className="text-graphite" fontSize={9.5} letterSpacing="0.06em">
        {meridians.map((m) => (
          <text key={m.lon} x={m.x + 4} y={18}>
            {m.lon.toFixed(1)}°E
          </text>
        ))}
        {parallels.map((p) => (
          <text key={p.lat} x={10} y={p.y - 5}>
            {p.lat.toFixed(1)}°N
          </text>
        ))}
        <text x={paris[0] - 6} y={paris[1] - 64} textAnchor="middle" fontSize={11} letterSpacing="0.4em">
          PARIS
        </text>
        <text x={760} y={404}>
          0
        </text>
        <text x={760 + fiveKm} y={404} textAnchor="end">
          5 KM
        </text>
        <text x={846} y={386} textAnchor="middle">
          N
        </text>
      </g>
      <g className="text-graphite">
        <Strokes d={[...scaleBar, ...north]} width={0.9} />
      </g>

      {/* The route, in ink. */}
      <g className="text-ink">
        <Strokes d={routeD} width={1.4} className="draw" />
      </g>

      {route.map((s, i) => {
        const label = LABELS[i] ?? LABELS[0];
        const ring = ink.ellipse(s.at[0], s.at[1], 19, 19, 90 + i, { roughness: 0.7 });
        return (
          <g key={s.name}>
            <circle cx={s.at[0]} cy={s.at[1]} r={9} className="fill-paper-deep" />
            <g className={i === route.length - 1 ? 'text-accent' : 'text-ink'}>
              <Strokes d={ring} width={1.2} />
            </g>
            <text
              x={s.at[0]}
              y={s.at[1] + 3.5}
              textAnchor="middle"
              fontSize={10}
              fontWeight={500}
              className="fill-ink"
            >
              {i + 1}
            </text>
            <g
              textAnchor={label.anchor}
              paintOrder="stroke"
              strokeWidth={5}
              strokeLinejoin="round"
              className="stroke-paper-deep"
            >
              <text
                x={s.at[0] + label.dx}
                y={s.at[1] + label.dy}
                fontSize={16}
                className="fill-ink font-display"
              >
                {s.name}
              </text>
              <text
                x={s.at[0] + label.dx}
                y={s.at[1] + label.dy + 16}
                fontSize={9.5}
                letterSpacing="0.06em"
                className="fill-graphite"
              >
                {`${s.place} · ${s.period}`.toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      <text x={430} y={300} fontSize={21} className="fill-accent font-hand" transform="rotate(-22 430 300)">
        {crowKm} km as the crow flies
      </text>
    </svg>
  );
}

export default function RouteMap() {
  const route = spread(stops());
  const rail = ink.line([4, 0], [4, 100], 3, { roughness: 0.6, disableMultiStroke: true });

  return (
    <figure className="plate border-y border-ink/15">
      <InkDraw className="hidden px-4 py-6 md:block lg:px-8">
        <RoutePlate route={route} />
      </InkDraw>

      {/* Phones: the same route as a vertical list, oldest first. On desktop
          it stays available to screen readers in place of the drawing. */}
      <ol className="px-4 py-6 md:sr-only">
        {route.map((s, i) => (
          <li key={s.name} className="relative grid grid-cols-[2rem_1fr] gap-x-3">
            <div className="flex justify-center">
              <span
                className={
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-step--2 ' +
                  (i === route.length - 1 ? 'border-accent text-accent' : 'border-ink')
                }
              >
                {i + 1}
              </span>
              {i < route.length - 1 ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 8 100"
                  preserveAspectRatio="none"
                  className="absolute left-[calc(1rem-4px)] top-8 h-[calc(100%-2.25rem)] w-2 text-ink"
                >
                  <Strokes d={rail} width={1.2} />
                </svg>
              ) : null}
            </div>
            <div className="pb-7 pt-0.5">
              <p className="font-display text-step-1 leading-tight">{s.name}</p>
              <p className="label mt-1 text-step--2 text-graphite">
                {s.place} · {s.period}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
