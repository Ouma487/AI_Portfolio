import { personalData } from '@/lib/data';
import ExternalLink from '@/components/external-link';
import CurrentYear from '@/components/current-year';
import { InkRule } from '@/components/ink';

/** Footer: back to top, copyright and social links. */
export default function SiteFooter() {
  return (
    <footer className="frame pb-8">
      <InkRule seed={7} strong className="text-ink" />
      <p className="label flex justify-end pt-8 text-graphite">
        <a href="#main" className="hit link">
          Back to top<span aria-hidden="true">&nbsp;↑</span>
        </a>
      </p>
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
