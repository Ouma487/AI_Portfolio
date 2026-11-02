import { ink } from '@/lib/rough';
import { Strokes } from '@/components/ink';

/**
 * Fig. 3: one step of a convolution, the basic operation of computer vision
 * models, for the Computer Vision & AI degree. A 3×3 kernel over a 6×6 input
 * (stride 1, no padding) produces a 4×4 feature map; the highlighted window
 * produces the highlighted output cell. The sizes are arithmetically true:
 * 6 − 3 + 1 = 4.
 */

const CELL = 16;
const IN: [number, number] = [8, 34]; // top-left of the 6×6 input
const OUT: [number, number] = [172, 50]; // top-left of the 4×4 feature map
const WIN = { col: 1, row: 1 }; // kernel position = output cell

function grid(origin: [number, number], n: number, seed: number): string[] {
  const [x0, y0] = origin;
  const size = n * CELL;
  return Array.from({ length: n + 1 }, (_, i) => [
    ...ink.line([x0 + i * CELL, y0], [x0 + i * CELL, y0 + size], seed + i, {
      roughness: 0.35,
      disableMultiStroke: true,
    }),
    ...ink.line([x0, y0 + i * CELL], [x0 + size, y0 + i * CELL], seed + 20 + i, {
      roughness: 0.35,
      disableMultiStroke: true,
    }),
  ]).flat();
}

function box(x: number, y: number, w: number, h: number, seed: number): string[] {
  return ink.polyline(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ],
    seed,
    { roughness: 0.6 }
  );
}

export default function ConvolutionSketch() {
  const win = { x: IN[0] + WIN.col * CELL, y: IN[1] + WIN.row * CELL, s: 3 * CELL };
  const cell = { x: OUT[0] + WIN.col * CELL, y: OUT[1] + WIN.row * CELL };

  return (
    <figure>
      <svg
        viewBox="0 0 250 196"
        role="img"
        aria-labelledby="fig3-title"
        className="h-auto w-full max-w-[18rem] overflow-visible font-mono"
      >
        <title id="fig3-title">
          Sketch of a convolution: a 3 by 3 kernel over a 6 by 6 input produces one cell of a 4
          by 4 feature map.
        </title>
        <g className="text-graphite">
          <Strokes d={grid(IN, 6, 200)} width={0.7} />
          <Strokes d={grid(OUT, 4, 300)} width={0.7} />
        </g>
        {/* Where the window lands, in pencil construction lines. */}
        <g className="text-pencil" stroke="currentColor" strokeWidth={0.8} strokeDasharray="2 3">
          <line x1={win.x + win.s} y1={win.y} x2={cell.x} y2={cell.y} />
          <line x1={win.x + win.s} y1={win.y + win.s} x2={cell.x} y2={cell.y + CELL} />
        </g>
        <rect x={cell.x} y={cell.y} width={CELL} height={CELL} className="fill-accent/20" />
        <g className="text-accent">
          <Strokes d={box(win.x, win.y, win.s, win.s, 401)} width={1.5} />
          <Strokes d={box(cell.x, cell.y, CELL, CELL, 402)} width={1.4} />
        </g>
        <g fill="currentColor" className="text-graphite" fontSize={9.5} letterSpacing="0.05em">
          <text x={IN[0]} y={IN[1] - 10}>
            INPUT 6×6
          </text>
          <text x={OUT[0]} y={OUT[1] - 10}>
            MAP 4×4
          </text>
          <text x={win.x} y={IN[1] + 6 * CELL + 16} className="fill-accent">
            KERNEL 3×3
          </text>
        </g>
        <text x={118} y={186} fontSize={19} textAnchor="middle" className="fill-accent font-hand">
          stride 1, no padding
        </text>
      </svg>
      <figcaption className="mt-3 text-step--1 text-graphite">
        <span className="label mr-2 text-ink">Fig. 3</span>
        A convolution, the first operation of most vision models: each window of the image
        becomes one value of the feature map.
      </figcaption>
    </figure>
  );
}
