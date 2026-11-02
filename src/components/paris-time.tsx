'use client';

import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
});

/**
 * Local time in Paris, refreshed every 15 seconds. Rendered as "--:--" on the
 * server (a pre-rendered page can't know when you'll visit) and filled in once
 * the page is running in the browser.
 */
export default function ParisTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{now ?? '--:--'}</span>;
}
