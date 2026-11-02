import { sectionMeta } from '@/lib/site';

type SectionHeaderProps = {
  /** Section id, as used in `navigation` (without the #). */
  id: string;
  title: React.ReactNode;
  /** Optional short paragraph shown under the title. */
  intro?: React.ReactNode;
};

/**
 * The one header every home-page section shares: a hairline rule, the mono
 * index and label in the left three columns, the title from column 4.
 * The index comes from the section's position in `navigation`, so
 * reordering the nav renumbers the page.
 */
export default function SectionHeader({ id, title, intro }: SectionHeaderProps) {
  const { index, label } = sectionMeta(id);
  return (
    <header className="grid-12 rule reveal gap-y-6 pt-4">
      <p className="label md:col-span-3">
        <span className="tabular-nums">{index}</span>
        <span aria-hidden="true"> — </span>
        {label}
      </p>
      <div className="md:col-span-9">
        <h2 id={`${id}-title`} className="display text-step-5">
          {title}
        </h2>
        {intro ? <p className="mt-6 max-w-measure text-step-1 text-mute">{intro}</p> : null}
      </div>
    </header>
  );
}
