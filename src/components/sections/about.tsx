import Image from 'next/image';
import { personalData } from '@/lib/data';
import SectionHeader from '@/components/section-header';

export default function About() {
  const [lead, ...rest] = personalData.about;

  return (
    <section id="about" aria-labelledby="about-title" className="frame pb-section">
      <SectionHeader id="about" title="About" />

      <div className="grid-12 mt-12 gap-y-12 md:mt-16">
        <div className="reveal max-w-xs md:col-span-4 md:max-w-none lg:col-span-3">
          {/* Mounted like a photograph pasted into the journal. */}
          <div className="mounted">
            <Image
              src={personalData.portrait.src}
              alt={personalData.portraitAlt}
              width={personalData.portrait.width}
              height={personalData.portrait.height}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 20rem"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="reveal text-step-2 leading-snug">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph} className="reveal mt-6 max-w-measure">
              {paragraph}
            </p>
          ))}

          {personalData.languages.length ? (
            <div className="reveal mt-12 max-w-measure">
              <h3 className="label text-graphite">Languages</h3>
              <dl className="mt-3 border-t border-ink/60">
                {personalData.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3"
                  >
                    <dt className="font-display text-step-1">{lang.name}</dt>
                    <dd className="label text-graphite">{lang.level}</dd>
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
