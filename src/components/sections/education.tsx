import { education } from '@/lib/data';
import { splitPeriod } from '@/lib/site';
import SectionHeader from '@/components/section-header';

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="frame pb-section">
      <SectionHeader id="education" title="Education" />

      <ol className="mt-16 md:mt-24">
        {education.map((entry) => {
          const [from, to] = splitPeriod(entry.period);
          return (
            <li
              key={entry.institution}
              className="reveal grid-12 gap-y-4 border-t border-ink/20 py-10 first:border-ink"
            >
              <div className="label md:col-span-3">
                <p className="tabular-nums">
                  {from}
                  {to ? (
                    <>
                      <span aria-hidden="true"> — </span>
                      <span className="sr-only"> to </span>
                      {to}
                    </>
                  ) : null}
                </p>
                {entry.location ? (
                  <p className="mt-2 text-step--2 text-mute">{entry.location}</p>
                ) : null}
              </div>

              <div className="md:col-span-6">
                <h3 className="display text-step-3">{entry.institution}</h3>
                <p className="mt-2 font-serif text-step-1 italic">{entry.degree}</p>
                {entry.summary ? (
                  <p className="mt-4 max-w-measure text-mute">{entry.summary}</p>
                ) : null}
                {entry.highlights?.length ? (
                  <ul className="mt-4 max-w-measure space-y-2">
                    {entry.highlights.map((h) => (
                      <li key={h} className="grid grid-cols-[2.25rem_1fr]">
                        <span aria-hidden="true" className="label pt-1 text-step--2">
                          ★
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {entry.coursework?.length ? (
                <div className="md:col-span-3">
                  <p className="label text-step--2 text-mute">Coursework</p>
                  <ul className="mt-2 font-mono text-step--1 leading-relaxed">
                    {entry.coursework.map((c) => (
                      <li key={c}>{c}</li>
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
