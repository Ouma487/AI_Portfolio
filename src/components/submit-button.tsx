'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group flex min-h-14 w-full items-center justify-between border border-ink bg-ink px-5 text-left font-display text-step-1 text-paper transition-colors duration-200 hover:border-accent hover:bg-accent disabled:cursor-wait disabled:opacity-60"
    >
      <span>{pending ? 'Sending…' : 'Send message'}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
