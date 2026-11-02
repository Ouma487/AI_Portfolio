'use client';

import { useFormState } from 'react-dom';
import { submitContactForm, type FormState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import ExternalLink from '@/components/external-link';
import { personalData } from '@/lib/data';
import { sectionMeta } from '@/lib/site';
import { cn } from '@/lib/utils';

const initialState: FormState = {
  message: '',
  success: false,
};

type FieldName = keyof NonNullable<FormState['errors']>;

const fieldClass =
  'peer w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-3 font-serif text-step-1 text-ink placeholder:text-mute/70 focus:border-b-2 focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-b-2';

function Field({
  name,
  label,
  errors,
  children,
}: {
  name: FieldName;
  label: string;
  errors?: string[];
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="label block text-mute">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(errors),
        'aria-describedby': errors ? errorId : undefined,
      })}
      {errors ? (
        <p id={errorId} className="label mt-2 text-step--2 normal-case tracking-normal text-ink">
          <span aria-hidden="true" className="mr-2 inline-block bg-ink px-1 text-paper">
            !
          </span>
          {errors.join(', ')}
        </p>
      ) : null}
    </div>
  );
}

const Contact = () => {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const { index, label } = sectionMeta('contact');

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="inverted bg-paper text-ink"
    >
      <div className="frame py-section">
        <header className="grid-12 gap-y-6 border-t border-ink pt-4">
          <p className="label md:col-span-3">
            <span className="tabular-nums">{index}</span>
            <span aria-hidden="true"> — </span>
            {label}
          </p>
          <h2 id="contact-title" className="display text-display md:col-span-9">
            Let&apos;s <span className="text-outline">talk.</span>
          </h2>
        </header>

        <div className="grid-12 mt-16 gap-y-16 md:mt-24">
          <div className="md:col-span-4 md:col-start-4">
            <p className="text-step-1 text-mute">
              A role, a research problem or a model that needs to work in production: write to me.
            </p>
            <a
              href={`mailto:${personalData.email}`}
              className="link mt-6 inline-block break-words font-display text-step-1 font-bold"
            >
              {personalData.email}
            </a>
            <ul className="label mt-8 flex flex-wrap gap-x-6">
              {personalData.socials
                .filter((s) => s.kind !== 'email')
                .map((s) => (
                  <li key={s.kind}>
                    <ExternalLink href={s.url} className="hit link">
                      {s.label} <span aria-hidden="true">&nbsp;↗</span>
                    </ExternalLink>
                  </li>
                ))}
              <li>
                <a href={personalData.resumeUrl} download className="hit link">
                  Résumé <span aria-hidden="true">&nbsp;↓</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8">
            {state.success ? (
              <div role="status" className="border-t border-ink pt-6">
                <p className="display text-step-4">Message sent.</p>
                <p className="mt-4 text-step-1 text-mute">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-8">
                {/* Honeypot: hidden from people, but bots that fill every field fill this one. */}
                <div
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
                >
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <Field name="name" label="Name *" errors={state.errors?.name}>
                  {(p) => (
                    <input {...p} type="text" name="name" required autoComplete="name" className={fieldClass} />
                  )}
                </Field>

                <Field name="email" label="Email *" errors={state.errors?.email}>
                  {(p) => (
                    <input {...p} type="email" name="email" required autoComplete="email" className={fieldClass} />
                  )}
                </Field>

                <Field name="website" label="Website (optional)" errors={state.errors?.website}>
                  {(p) => (
                    <input
                      {...p}
                      type="text"
                      name="website"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="https://"
                      className={fieldClass}
                    />
                  )}
                </Field>

                <Field name="message" label="Message *" errors={state.errors?.message}>
                  {(p) => (
                    <textarea
                      {...p}
                      name="message"
                      required
                      rows={5}
                      className={cn(fieldClass, 'resize-y')}
                    />
                  )}
                </Field>

                {!state.success && state.message && !state.errors && (
                  <p className="label border border-ink p-3 normal-case tracking-normal" role="alert">
                    {state.message}
                  </p>
                )}
                {state.errors ? (
                  <p className="sr-only" role="alert">
                    {state.message}
                  </p>
                ) : null}

                <SubmitButton />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
