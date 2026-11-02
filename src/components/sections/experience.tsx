import { sortedExperience, splitPeriod } from '@/lib/site';
import SectionHeader from '@/components/section-header';
import { InkRule } from '@/components/ink';
import Timeline from '@/components/sketches/timeline';

/**
 * Fig. 2 (the timeline) opens the section, then the entries, newest first: dates
 * in the margin, the entry in the text column, the stack in the outer margin.
 * The current role gets a margin note pointing back to Fig. 1, because that is
 * the work the calibration sketch is about.
 */
export default function Experience() {
  const entries = sortedExperience();

  return (
    <section id="experience" aria-labelledby="experience-title" className="frame pb-section">
      <SectionHeader id="experience" title="Experience" />

      <div className="grid-12 mt-12 md:mt-16">
        <div className="md:col-span-12 xl:col-span-9 xl:col-start-4">
          <Timeline />
        </div>
      </div>

      <ol className="mt-16 md:mt-24">
        {entries.map((job, i) => {
          const [from, to] = splitPeriod(job.period);
          const ongoing = !job.end;
          return (
            <li key={`${job.company}-${job.start}`} className="reveal">
              {i > 0 ? <InkRule seed={110 + i} className="text-ink/35" /> : null}
              <div className="grid-12 gap-y-4 py-10">
                <div className="label text-graphite md:col-span-3">
                  <p className="tabular-nums text-ink">
                    <time dateTime={job.start}>{from}</time>
                    <span aria-hidden="true"> – </span>
                    <span className="sr-only"> to </span>
                    {ongoing ? (
                      <span className="text-accent">{to ?? 'Present'}</span>
                    ) : (
                      <time dateTime={job.end}>{to}</time>
                    )}
                  </p>
                  <p className="mt-2 text-step--2">
                    {[job.location, job.employmentType].filter(Boolean).join(' · ')}
                  </p>
                </div>

                <div className="md:col-span-6">
                  <h3 className="display text-step-3">
                    {job.role}
                    <span className="mt-1 block font-sans text-step-1 italic text-graphite">
                      at {job.company}
                    </span>
                  </h3>
                  <p className="mt-5 max-w-measure text-step-1 leading-snug">{job.summary}</p>
                  <ul className="mt-6 max-w-measure space-y-3">
                    {job.highlights.map((h, j) => (
                      <li key={h} className="grid grid-cols-[1.75rem_1fr]">
                        <span aria-hidden="true" className="font-sans italic text-graphite">
                          {String.fromCharCode(97 + j)}.
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-3">
                  {job.stack?.length ? (
                    <>
                      <p className="label text-step--2 text-graphite">Stack</p>
                      <ul className="mt-2 font-mono text-step--1 leading-relaxed">
                        {job.stack.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
