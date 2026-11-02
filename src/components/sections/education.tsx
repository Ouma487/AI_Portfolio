import { education } from '@/lib/data';
import { splitPeriod } from '@/lib/site';
import SectionHeader from '@/components/section-header';
import { InkRule } from '@/components/ink';
import ConvolutionSketch from '@/components/sketches/convolution';

/** The AI degree gets Fig. 3 (a convolution) in its margin. */
const isAiDegree = (degree: string) => /\bAI\b|computer vision/i.test(degree);

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="frame pb-section">
      <SectionHeader id="education" title="Education" />

      <ol className="mt-12 md:mt-16">
        {education.map((entry, i) => {
          const [from, to] = splitPeriod(entry.period);
          return (
            <li key={entry.institution} className="reveal">
              {i > 0 ? <InkRule seed={130 + i} className="text-ink/35" /> : null}
              <div className="grid-12 gap-y-4 py-10">
                <div className="label text-graphite md:col-span-3">
                  <p className="tabular-nums text-ink">
                    {from}
                    {to ? (
                      <>
                        <span aria-hidden="true"> – </span>
                        <span className="sr-only"> to </span>
                        {to}
                      </>
                    ) : null}
                  </p>
                  {entry.location ? <p className="mt-2 text-step--2">{entry.location}</p> : null}
                </div>

                <div className="md:col-span-6">
                  <h3 className="display text-step-3">{entry.institution}</h3>
                  <p className="mt-2 text-step-1 italic text-graphite">{entry.degree}</p>
                  {entry.summary ? <p className="mt-4 max-w-measure">{entry.summary}</p> : null}
                  {entry.highlights?.length ? (
                    <ul className="mt-5 max-w-measure space-y-2">
                      {entry.highlights.map((h) => (
                        <li key={h} className="grid grid-cols-[1.75rem_1fr]">
                          <span aria-hidden="true" className="text-accent">
                            →
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.coursework?.length ? (
                    <div className="mt-6 max-w-measure">
                      <p className="label text-step--2 text-graphite">Coursework</p>
                      <ul className="mt-2 flex flex-wrap">
                        {entry.coursework.map((c, j) => (
                          <li key={c}>
                            {c}
                            {j < entry.coursework!.length - 1 ? (
                              <span aria-hidden="true" className="px-2 text-pencil">
                                ·
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {isAiDegree(entry.degree) ? (
                  <div className="mt-4 md:col-span-3 md:mt-0">
                    <ConvolutionSketch />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
