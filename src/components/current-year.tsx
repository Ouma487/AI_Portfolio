'use client';

import { useEffect, useState } from 'react';

/**
 * The page is pre-rendered at build time, so a year computed on the server
 * would freeze at the build year. This renders that year first (so the HTML
 * is never empty) and corrects it in the browser if the calendar has moved on.
 */
export default function CurrentYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <time dateTime={String(year)}>{year}</time>;
}
