'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="bg-black text-white hover:bg-gray-800">
      {pending ? 'Sending...' : 'Get in Touch'}
    </Button>
  );
}
