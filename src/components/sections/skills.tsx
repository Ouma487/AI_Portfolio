import Image from 'next/image';
import { aiDomains, skillGroups, skills } from '@/lib/data';
import SectionHeader from '@/components/section-header';

/**
 * Three typographic layers instead of a grid of icon cards:
 * 1. the AI domains as a run of large type, alternating solid and outlined;
 * 2. the full inventory as a two-column table (group | items);
 * 3. the everyday toolbox as a single mono strip with greyscale icons.
 */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="frame pb-section">
      <SectionHeader id="skills" title="Skills" />

      <div className="grid-12 mt-16 md:mt-24">
        <h3 className="label text-mute md:col-span-3">Domains</h3>
        <ul className="reveal mt-4 flex flex-wrap items-baseline gap-y-1 md:col-span-9 md:mt-0">
          {aiDomains.map((domain, i) => (
            <li key={domain} className="display text-step-4">
              <span className={i % 2 === 1 ? 'text-outline' : undefined}>{domain}</span>
              {i < aiDomains.length - 1 ? (
                <span aria-hidden="true" className="px-[0.2em] font-serif font-normal italic text-mute" style={{ fontStretch: '100%' }}>
                  /
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid-12 mt-20">
        <h3 className="label text-mute md:col-span-3">Inventory</h3>
        <dl className="mt-4 md:col-span-9 md:mt-0">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="reveal grid gap-x-gutter gap-y-1 border-t border-ink/20 py-4 first:border-ink sm:grid-cols-[minmax(10rem,1fr)_3fr]"
            >
              <dt className="label pt-1">{group.title}</dt>
              <dd className="text-step-1">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid-12 mt-20">
        <h3 className="label text-mute md:col-span-3">Daily toolbox</h3>
        <ul className="reveal mt-4 flex flex-wrap border-l border-t border-ink md:col-span-9 md:mt-0">
          {skills.map((tool) => (
            <li
              key={tool.name}
              className="flex min-h-14 grow basis-1/2 items-center gap-3 border-b border-r border-ink px-4 py-3 sm:basis-1/4"
            >
              <Image
                src={tool.icon}
                alt=""
                width={20}
                height={20}
                className="mono-img h-5 w-5 object-contain"
              />
              <span className="font-mono text-step--1">{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
