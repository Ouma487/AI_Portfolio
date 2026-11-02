import { sortedExperience, splitPeriod } from '@/lib/site';
import SectionHeader from '@/components/section-header';

/**
 * A ledger: dates in mono in the left column, the entry on the right.
 * Works for any number of entries; ongoing roles are sorted first and marked.
 */
export default function Experience() {
  const entries = sortedExperience();

  return (
    <section id="experience" aria-labelledby="experience-title" className="frame pb-section">
      <SectionHeader id="experience" title="Experience" />

      <ol className="mt-16 md:mt-24">
        {entries.map((job) => {
          const [from, to] = splitPeriod(job.period);
          const ongoing = !job.end;
          return (
            <li key={`${job.company}-${job.start}`} className="reveal grid-12 gap-y-4 border-t border-ink/20 py-10 first:border-ink">
              <div className="label md:col-span-3">
                <p className="tabular-nums">
                  <time dateTime={job.start}>{from}</time>
                  <span aria-hidden="true"> — </span>
                  <span className="sr-only"> to </span>
                  {ongoing ? (
                    <span className="inline-flex items-center gap-1.5 bg-ink px-1.5 text-paper">{to ?? 'Present'}</span>
                  ) : (
                    <time dateTime={job.end}>{to}</time>
                  )}
                </p>
                <p className="mt-2 text-step--2 text-mute">
                  {[job.location, job.employmentType].filter(Boolean).join(' · ')}
                </p>
              </div>

              <div className="md:col-span-6">
                <h3 className="display text-step-3">
                  {job.role}
                  <span className="font-serif text-step-2 font-normal italic tracking-normal text-mute" style={{ fontStretch: '100%' }}>
                    {' '}at {job.company}
                  </span>
                </h3>
                <p className="mt-4 max-w-measure text-step-1">{job.summary}</p>
                <ul className="mt-6 max-w-measure space-y-3">
                  {job.highlights.map((h, i) => (
                    <li key={h} className="grid grid-cols-[2.25rem_1fr] text-mute">
                      <span aria-hidden="true" className="label pt-1 text-step--2 tabular-nums text-ink">
                        {String.fromCharCode(97 + i)}.
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {job.stack?.length ? (
                <div className="md:col-span-3">
                  <p className="label text-step--2 text-mute">Stack</p>
                  <ul className="mt-2 font-mono text-step--1 leading-relaxed">
                    {job.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
