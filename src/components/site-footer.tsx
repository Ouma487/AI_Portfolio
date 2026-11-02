import { personalData } from '@/lib/data';
import ExternalLink from '@/components/external-link';
import CurrentYear from '@/components/current-year';

export default function SiteFooter() {
  return (
    <footer className="inverted bg-paper text-ink">
      <div className="frame pb-6 pt-16 md:pt-24">
        <p aria-hidden="true" className="display select-none whitespace-nowrap text-display text-outline">
          {personalData.name.split(' ')[0]}
        </p>
        <div className="grid-12 mt-10 gap-y-2 border-t border-ink pt-4">
          <p className="label hit md:col-span-4">
            ©&nbsp;
            <CurrentYear buildYear={new Date().getFullYear()} />
            &nbsp;{personalData.name}
          </p>
          <ul className="label flex flex-wrap gap-x-6 md:col-span-6">
            {personalData.socials.map((s) => (
              <li key={s.kind}>
                <ExternalLink href={s.url} className="hit link">
                  {s.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
          <p className="label md:col-span-2 md:text-right">
            <a href="#main" className="hit link">
              Back to top<span aria-hidden="true">&nbsp;↑</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
