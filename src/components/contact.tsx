'use client';

import { useFormState } from 'react-dom';
import { submitContactForm, type FormState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Linkedin, Github, Mail } from 'lucide-react';
import { Button } from './ui/button';

const initialState: FormState = {
  message: '',
  success: false,
};

const Contact = () => {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <section id="contact" className="py-20 bg-white border-t border-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">
          {/* Left: Form */}
          <div className="space-y-6">
            {state.success ? (
              <div className="text-center p-8 border border-black bg-gray-50 text-black rounded-none">
              <h3 className="text-2xl font-semibold tracking-tight">Message Sent!</h3>
              <p className="mt-2 text-gray-600">{state.message}</p>
            </div>
            
            ) : (
              <form action={formAction} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name*"
                  required
                  className="border border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                />
                {state.errors?.name && (
                  <p className="text-red-500 text-sm">{state.errors.name.join(', ')}</p>
                )}

                <Input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  required
                  className="border border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                />
                {state.errors?.email && (
                  <p className="text-red-500 text-sm">{state.errors.email.join(', ')}</p>
                )}

                <Input
                  type="text"
                  name="website"
                  placeholder="Your website (If exists)"
                  className="border border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                />

                <Textarea
                  name="message"
                  placeholder="How can I help?*"
                  required
                  rows={5}
                  className="border border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                />
                {state.errors?.message && (
                  <p className="text-red-500 text-sm">{state.errors.message.join(', ')}</p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <SubmitButton />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border border-black rounded-none"
                      asChild
                    >
                      <a
                        href="https://linkedin.com/in/oumaimachater"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5 text-black" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border border-black rounded-none"
                      asChild
                    >
                      <a
                        href="https://github.com/Ouma487"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-5 w-5 text-black" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border border-black rounded-none"
                      asChild
                    >
                      <a href="mailto:chtr.oumaima@gmail.com">
                        <Mail className="h-5 w-5 text-black" />
                      </a>
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right: Text */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold leading-snug">
              Let&apos;s <span className="text-outline font-bold">talk</span> for
              <br />
              Something special
            </h2>
            <p className="mt-4 text-lg font-medium text-black">
              chtr.oumaima@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
