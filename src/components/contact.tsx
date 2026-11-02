import ExternalLink from '@/components/external-link';
import SectionHeader from '@/components/section-header';
import ContactForm from '@/components/contact-form';
import { personalData } from '@/lib/data';

/**
 * The last entry: how to reach her. Server-rendered; only the form itself
 * (contact-form.tsx) is a client component, so the hand-drawn header doesn't
 * pull rough.js into the browser bundle.
 */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="frame pb-section">
      <SectionHeader id="contact" title="Let’s talk." />

      <div className="grid-12 mt-12 gap-y-16 md:mt-16">
        <div className="md:col-span-4 md:col-start-4">
          <p className="text-step-1 italic text-graphite">
            A role, a research problem or a model that needs to work in production: write to me.
          </p>
          <a
            href={`mailto:${personalData.email}`}
            className="link mt-6 inline-block break-all font-display text-step-2 sm:break-words"
          >
            {personalData.email}
          </a>
          <ul className="label mt-8 flex flex-wrap gap-x-6">
            {personalData.socials
              .filter((s) => s.kind !== 'email')
              .map((s) => (
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

        <div className="md:col-span-5 md:col-start-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
