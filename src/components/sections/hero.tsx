import Image from 'next/image';
import { aiDomains, personalData } from '@/lib/data';
import { currentRole } from '@/lib/site';
import ExternalLink from '@/components/external-link';
import ParisTime from '@/components/paris-time';

export default function Hero() {
  const role = currentRole();
  const [firstName, ...rest] = personalData.name.split(' ');
  const lastName = rest.join(' ');
  const [titleFirst, ...titleRest] = personalData.title.split(' ');

  return (
    <section aria-labelledby="hero-title" className="frame pb-section pt-8 md:pt-12">
      {/* Status line: the live, slightly personal detail. */}
      <div className="label flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-ink pb-3">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="pulse inline-block h-2 w-2 rounded-full bg-ink" />
          {role ? (
            <span>
              Now — {role.role}, {role.company}
            </span>
          ) : (
            <span>{personalData.title}</span>
          )}
        </span>
        <span className="text-mute">
          Paris <ParisTime />
        </span>
        <span className="hidden text-mute md:ml-auto md:inline">Portfolio — Index</span>
      </div>

      <div className="grid-12 relative gap-y-10 pt-10 md:pt-16">
        <h1
          id="hero-title"
          className="display relative z-10 text-display md:col-span-12"
        >
          <span className="block">{firstName}</span>{' '}
          <span className="block md:pl-[calc((100%-11*var(--gutter))/12+var(--gutter))]">{lastName}</span>{' '}
          <span className="mt-[0.08em] block">
            {titleFirst}{' '}
            <span className="text-outline">{titleRest.join(' ')}</span>
          </span>
        </h1>

        {/* Figure: placed on the grid, overlapping the type on desktop. */}
        <figure className="md:absolute md:right-0 md:top-16 md:w-[min(19vw,17rem)]">
          <Image
            src={personalData.heroImage.src}
            alt={personalData.heroImageAlt}
            width={personalData.heroImage.width}
            height={personalData.heroImage.height}
            priority
            sizes="(min-width: 768px) 19vw, 60vw"
            className="mx-auto h-auto w-3/5 md:w-full"
          />
          <figcaption className="label mt-2 text-center text-step--2 text-mute md:text-right">
            Fig. 0 — At work
          </figcaption>
        </figure>

        <p className="font-serif text-step-2 italic leading-snug md:col-span-6 md:col-start-1">
          Based in {personalData.location}.{' '}
          <span className="not-italic text-mute">{personalData.headline}</span>
        </p>

        <dl className="label grid grid-cols-2 gap-x-gutter gap-y-6 self-end md:col-span-5 md:col-start-8">
          <div className="border-t border-ink pt-2">
            <dt className="text-mute">Field notes</dt>
            <dd className="mt-1 normal-case tracking-normal">
              {aiDomains.slice(0, 4).join(' / ')}
            </dd>
          </div>
          <div className="border-t border-ink pt-2">
            <dt className="text-mute">Elsewhere</dt>
            <dd className="mt-1">
              <ul>
                {personalData.socials.map((s) => (
                  <li key={s.kind}>
                    <ExternalLink href={s.url} className="hit link">
                      {s.label} <span aria-hidden="true">&nbsp;↗</span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
