import { personalData } from '@/lib/data';
import ExternalLink from '@/components/external-link';
import CurrentYear from '@/components/current-year';
import { InkRule } from '@/components/ink';

/** A colophon, as at the back of a printed book. */
export default function SiteFooter() {
  return (
    <footer className="frame pb-8">
      <InkRule seed={7} strong className="text-ink" />
      <div className="grid-12 gap-y-6 pt-8">
        <p className="caps text-graphite md:col-span-3">Colophon</p>
        <p className="max-w-measure text-step--1 text-graphite md:col-span-6">
          Set in Libre Caslon and IBM Plex Mono, with marginal notes in La Belle Aurore. Sketches
          are drawn in code with rough.js, from real coordinates and real definitions.
        </p>
        <p className="label text-graphite md:col-span-3 md:text-right">
          <a href="#main" className="hit link">
            Back to top<span aria-hidden="true">&nbsp;↑</span>
          </a>
        </p>
      </div>
      <div className="grid-12 mt-6 items-center gap-y-2 border-t border-ink/20 pt-2">
        <p className="label hit md:col-span-3">
          ©&nbsp;
          <CurrentYear buildYear={new Date().getFullYear()} />
          &nbsp;{personalData.name}
        </p>
        <ul className="label flex flex-wrap gap-x-6 md:col-span-9">
          {personalData.socials.map((s) => (
            <li key={s.kind}>
              <ExternalLink href={s.url} className="hit link">
                {s.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
