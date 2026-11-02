import Image from 'next/image';
import { personalData } from '@/lib/data';
import SectionHeader from '@/components/section-header';

export default function About() {
  const [lead, ...rest] = personalData.about;

  return (
    <section id="about" aria-labelledby="about-title" className="frame pb-section">
      <SectionHeader id="about" title="About" />

      <div className="grid-12 mt-16 gap-y-12 md:mt-24">
        <figure className="reveal md:col-span-4 lg:col-span-3">
          {/* Border and rounding are presentation, so they live in CSS
              (the Figma frame: 4px black border, 12px radius). */}
          <Image
            src={personalData.portrait.src}
            alt={personalData.portraitAlt}
            width={personalData.portrait.width}
            height={personalData.portrait.height}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="mono-img h-auto w-full rounded-[12px] border-4 border-ink transition-[filter] duration-500 hover:filter-none"
          />
          <figcaption className="label mt-3 text-step--2 text-mute">
            Fig. 1 — {personalData.name}, {personalData.location}
          </figcaption>
        </figure>

        <div className="md:col-span-7 md:col-start-6">
          <p className="reveal text-step-2 leading-snug">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph} className="reveal mt-6 max-w-measure text-step-1 text-mute">
              {paragraph}
            </p>
          ))}

          {personalData.languages.length ? (
            <div className="reveal mt-12">
              <h3 className="label text-mute">Languages</h3>
              <dl className="mt-3 border-t border-ink">
                {personalData.languages.map((lang) => (
                  <div key={lang.name} className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3">
                    <dt className="font-display text-step-1 font-bold">{lang.name}</dt>
                    <dd className="label text-mute">{lang.level}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
