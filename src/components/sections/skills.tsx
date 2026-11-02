import { aiDomains, skillGroups, skills } from '@/lib/data';
import SectionHeader from '@/components/section-header';

/**
 * Set as an index at the back of a notebook: the fields as a run of italic
 * type, the inventory as a two-column table, the daily tools as one line.
 * No icons: logos look the same on every portfolio and add noise here.
 */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="frame pb-section">
      <SectionHeader id="skills" title="Skills" />

      <div className="grid-12 mt-12 gap-y-4 md:mt-16">
        <h3 className="label pt-2 text-graphite md:col-span-3">Fields</h3>
        <ul className="reveal flex flex-wrap items-baseline gap-y-1 md:col-span-9">
          {aiDomains.map((domain, i) => (
            <li key={domain} className="font-display text-step-2">
              {domain}
              {i < aiDomains.length - 1 ? (
                <span aria-hidden="true" className="px-[0.35em] text-sketch">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid-12 mt-16 gap-y-4">
        <h3 className="label pt-4 text-graphite md:col-span-3">Inventory</h3>
        <dl className="md:col-span-9">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="reveal grid gap-x-gutter gap-y-1 border-t border-ink/20 py-4 first:border-ink/60 sm:grid-cols-[minmax(10rem,1fr)_3fr]"
            >
              <dt className="label pt-1">{group.title}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid-12 mt-16 gap-y-4">
        <h3 className="label pt-1 text-graphite md:col-span-3">Daily toolbox</h3>
        <p className="reveal font-mono text-step--1 leading-relaxed md:col-span-9">
          {skills.map((tool) => tool.name).join('  /  ')}
        </p>
      </div>
    </section>
  );
}
