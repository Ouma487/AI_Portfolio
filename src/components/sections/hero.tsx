import { personalData } from '@/lib/data';
import { currentRole, firstYear } from '@/lib/site';
import ExternalLink from '@/components/external-link';
import ParisTime from '@/components/paris-time';
import { InkRule } from '@/components/ink';
import CalibrationSketch from '@/components/sketches/calibration';

/**
 * The title page of the journal: who keeps it, what she does, where and since
 * when. One sketch (Fig. 1) states the thesis of the work, calibrated
 * forecasting, and the live Paris time is set as an entry header.
 */
export default function Hero() {
  const role = currentRole();
  const city = role?.location?.split(',')[0] ?? personalData.location;

  return (
    <section aria-labelledby="hero-title" className="frame pb-section pt-8 md:pt-12">
      {/* Entry header: place, local time, current post. */}
      <div className="label flex flex-wrap items-center gap-x-6 gap-y-1 text-graphite">
        <span>
          {city}, <ParisTime />
        </span>
        {role ? (
          <span>
            Now: <span className="text-ink">{role.role}</span>, {role.company}
          </span>
        ) : null}
      </div>
      <InkRule seed={2} className="mt-3 text-ink" />

      <div className="grid-12 gap-y-14 pt-14 md:pt-20 lg:pt-24">
        <div className="md:col-span-7 lg:col-span-7">
          <h1 id="hero-title">
            <span className="caps block text-graphite">Field notes of</span>
            <span className="display mt-4 block text-display">{personalData.name}</span>
            <span className="mt-5 block font-serif text-step-2 italic">
              <span aria-hidden="true" className="text-graphite">— </span>
              {personalData.title}
            </span>
          </h1>
          <p className="label mt-6 text-graphite">
            {city}, {personalData.location === city ? '' : `${personalData.location} · `}
            {firstYear()} – present
          </p>

          <p className="mt-12 max-w-measure text-step-1">{personalData.headline}</p>

          <ul className="label mt-8 flex flex-wrap gap-x-6">
            {personalData.socials.map((s) => (
              <li key={s.kind}>
                <ExternalLink href={s.url} className="hit link">
                  {s.label}
                </ExternalLink>
              </li>
            ))}
            <li>
              <a href={personalData.resumeUrl} download className="hit link">
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>

        <figure className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <div className="plate border-y border-ink/15 px-4 pb-4 pt-6">
            <CalibrationSketch />
          </div>
          <figcaption className="mt-3 text-step--1 text-graphite">
            <span className="label mr-2 text-ink">Fig. 1</span>
            Calibration, schematic. A forecast is calibrated when the events it calls 70% likely
            happen about 70% of the time.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
