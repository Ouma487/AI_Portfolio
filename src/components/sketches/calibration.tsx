import { ink, sample } from '@/lib/rough';
import { Strokes } from '@/components/ink';
import InkDraw from '@/components/ink-draw';

/**
 * Fig. 1: a reliability diagram, the picture behind "calibrated forecasting".
 * x = the probability a model predicted, y = how often the event happened.
 * A calibrated model sits on the diagonal. The curve is a schematic (labelled
 * as such), not a plot of real results.
 */

// Plot area inside the 300 x 290 viewBox.
const X0 = 44;
const Y0 = 246;
const SIZE = 226;
const px = (p: number) => X0 + SIZE * p;
const py = (p: number) => Y0 - SIZE * p;

// Bin centres and a gently imperfect "observed" frequency for each.
const bins = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
const observed = [0.07, 0.13, 0.27, 0.33, 0.46, 0.56, 0.63, 0.76, 0.84, 0.93];

export default function CalibrationSketch() {
  const axes = ink.polyline(
    [
      [px(0), py(1.02)],
      [px(0), py(0)],
      [px(1.02), py(0)],
    ],
    11,
    { roughness: 0.6 }
  );
  const ticks = [0, 0.5, 1].flatMap((t, i) => [
    ...ink.line([px(t), py(0)], [px(t), py(0) + 5], 20 + i, { roughness: 0.3 }),
    ...ink.line([px(0) - 5, py(t)], [px(0), py(t)], 30 + i, { roughness: 0.3 }),
  ]);
  const curve = ink.curve(
    bins.map((b, i) => [px(b), py(observed[i])] as [number, number]),
    7,
    { roughness: 0.7, strokeWidth: 1.4 }
  );
  // Small arrow from the note to the diagonal.
  const arrow = [
    ...ink.curve(
      sample(0, 1, 6, (t) => [112 + 34 * t, 68 + 60 * t - 10 * Math.sin(Math.PI * t)]),
      41,
      { roughness: 0.5 }
    ),
    ...ink.polyline(
      [
        [145.3, 119],
        [146, 128],
        [138.7, 122.8],
      ],
      42,
      { roughness: 0.4 }
    ),
  ];

  return (
    <InkDraw>
      <svg
        viewBox="0 0 300 290"
        role="img"
        aria-labelledby="fig1-title"
        className="h-auto w-full overflow-visible font-mono text-ink"
      >
        <title id="fig1-title">
          Schematic reliability diagram: predicted probability against observed frequency, with
          the forecast curve lying close to the diagonal.
        </title>
        {/* Construction line: perfect calibration, in the faint sketch tone. */}
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(1)}
          y2={py(1)}
          className="text-sketch"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <g className="text-ink">
          <Strokes d={axes} className="draw" />
          <Strokes d={ticks} className="draw" />
          <Strokes d={curve} width={1.5} className="draw draw-late" />
          {bins.map((b, i) => (
            <circle key={b} cx={px(b)} cy={py(observed[i])} r={2.1} fill="currentColor" />
          ))}
        </g>
        <g fill="currentColor" className="text-graphite" fontSize={10}>
          <text x={px(0)} y={py(0) + 18} textAnchor="middle">0</text>
          <text x={px(0.5)} y={py(0) + 18} textAnchor="middle">0.5</text>
          <text x={px(1)} y={py(0) + 18} textAnchor="middle">1</text>
          <text x={px(0) - 10} y={py(0.5) + 3.5} textAnchor="end">0.5</text>
          <text x={px(0) - 10} y={py(1) + 3.5} textAnchor="end">1</text>
          <text x={px(0.5)} y={py(0) + 38} textAnchor="middle" letterSpacing="0.06em">
            PREDICTED
          </text>
          <text
            transform={`translate(${px(0) - 30} ${py(0.5)}) rotate(-90)`}
            textAnchor="middle"
            letterSpacing="0.06em"
          >
            OBSERVED
          </text>
        </g>
        <g className="text-accent">
          <Strokes d={arrow} width={1.1} className="draw draw-late" />
          <text
            x={64}
            y={58}
            fill="currentColor"
            className="font-hand"
            fontSize={19}
          >
            predicted = observed
          </text>
        </g>
      </svg>
    </InkDraw>
  );
}
