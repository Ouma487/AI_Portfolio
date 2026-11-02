/**
 * Hand-drawn ink strokes, generated with rough.js.
 *
 * rough.js turns a geometric shape (a line, an ellipse, a curve through some
 * points) into the wobbly path a pen would make. It does that with random
 * numbers, so we always pass a `seed`: the same seed gives the same wobble,
 * which means the server-rendered HTML and every later render match exactly
 * and the drawings never "jitter" between visits.
 *
 * We only use the *generator*, which does pure maths and returns SVG path
 * data. It needs no DOM, so all of this runs in server components at build
 * time and ships zero JavaScript to the browser.
 */
import rough from 'roughjs';
import type { Drawable, Options } from 'roughjs/bin/core';

type Point = [number, number];

const generator = rough.generator();

/** Defaults tuned for a fine pen: slight roughness, low bowing, 1 decimal. */
const pen: Options = {
  roughness: 0.9,
  bowing: 0.6,
  strokeWidth: 1,
  fixedDecimalPlaceDigits: 1,
};

function toD(drawable: Drawable): string[] {
  return generator.toPaths(drawable).map((p) => p.d);
}

export const ink = {
  line: (a: Point, b: Point, seed: number, options: Options = {}) =>
    toD(generator.line(a[0], a[1], b[0], b[1], { ...pen, seed, ...options })),
  /** A smooth curve through the points (Catmull-Rom, then roughened). */
  curve: (points: Point[], seed: number, options: Options = {}) =>
    toD(generator.curve(points, { ...pen, seed, ...options })),
  polyline: (points: Point[], seed: number, options: Options = {}) =>
    toD(generator.linearPath(points, { ...pen, seed, ...options })),
  ellipse: (cx: number, cy: number, w: number, h: number, seed: number, options: Options = {}) =>
    toD(generator.ellipse(cx, cy, w, h, { ...pen, seed, ...options })),
  /**
   * Only the hachure (diagonal pen hatching) that fills a rectangle, without
   * its outline, so the caller can draw an outline of its own (open-ended
   * for a period that has not finished yet).
   */
  hatch: (x: number, y: number, w: number, h: number, seed: number, options: Options = {}) =>
    toD(
      generator.rectangle(x, y, w, h, {
        ...pen,
        seed,
        stroke: 'none',
        fill: 'currentColor',
        fillStyle: 'hachure',
        hachureGap: 3.4,
        hachureAngle: -50,
        fillWeight: 0.8,
        ...options,
      })
    ),
};

/** Sample a function into points, for curves defined by an equation. */
export function sample(from: number, to: number, steps: number, f: (t: number) => Point): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => f(from + ((to - from) * i) / steps));
}
