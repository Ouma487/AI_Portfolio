'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className="w-fit border border-black bg-black text-white hover:bg-gray-900"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );
}
