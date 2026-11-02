'use client';

import { useFormState } from 'react-dom';
import { submitContactForm, type FormState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { cn } from '@/lib/utils';

const initialState: FormState = {
  message: '',
  success: false,
};

type FieldName = keyof NonNullable<FormState['errors']>;

const fieldClass =
  'peer w-full rounded-none border-0 border-b border-ink/50 bg-transparent px-0 py-3 font-sans text-step-1 text-ink placeholder:text-graphite/80 focus:border-b-2 focus:border-accent focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-accent';

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
      <label htmlFor={id} className="label block text-graphite">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(errors),
        'aria-describedby': errors ? errorId : undefined,
      })}
      {errors ? (
        <p id={errorId} className="mt-2 text-step--1 text-accent">
          <span aria-hidden="true" className="label mr-2 inline-block border border-accent px-1">
            !
          </span>
          {errors.join(', ')}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The form half of the contact section. A client component because
 * useFormState / useFormStatus need the browser; the rest of the section is
 * server-rendered (see contact.tsx).
 */
export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <>
      {state.success ? (
        <div role="status" className="border-t border-ink/60 pt-6">
          <p className="display text-step-4">Message sent.</p>
          <p className="mt-4 text-step-1 text-graphite">{state.message}</p>
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
            <p className="border border-accent p-3 text-step--1 text-accent" role="alert">
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
    </>
  );
}
