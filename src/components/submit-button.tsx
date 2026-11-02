'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group flex min-h-16 w-full items-center justify-between border border-ink bg-ink px-5 text-left font-display text-step-2 font-bold text-paper transition-colors duration-200 hover:bg-paper hover:text-ink disabled:cursor-wait disabled:opacity-60"
    >
      <span>{pending ? 'Sending…' : 'Send message'}</span>
      <span
        aria-hidden="true"
        className="font-mono transition-transform duration-300 ease-editorial group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
