import { sectionMeta } from '@/lib/site';
import { InkRule } from '@/components/ink';

type SectionHeaderProps = {
  /** Section id, as used in `navigation` (without the #). */
  id: string;
  title: React.ReactNode;
  /** Optional short paragraph shown under the title. */
  intro?: React.ReactNode;
};

/**
 * Every home-page section opens like a journal entry: "Entry II" in engraved
 * caps, the title in Caslon Display, and a pen rule. The numeral comes from
 * the section's position in `navigation`, so the numbering is always true to
 * the order on the page.
 */
export default function SectionHeader({ id, title, intro }: SectionHeaderProps) {
  const { numeral, label } = sectionMeta(id);
  const seed = numeral.length * 101 + id.length * 7;
  return (
    <header className="reveal">
      <div className="grid-12 items-baseline gap-y-3">
        <p className="caps text-graphite md:col-span-3">
          Entry <span className="text-ink">{numeral}</span>
          <span className="sr-only">, {label}</span>
        </p>
        <h2 id={`${id}-title`} className="display text-step-5 md:col-span-9">
          {title}
        </h2>
      </div>
      <InkRule seed={seed} strong className="mt-5 text-ink" />
      {intro ? (
        <div className="grid-12 mt-6">
          <p className="max-w-measure text-step-1 italic text-graphite md:col-span-9 md:col-start-4">
            {intro}
          </p>
        </div>
      ) : null}
    </header>
  );
}
