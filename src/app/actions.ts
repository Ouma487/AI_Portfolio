'use server';

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export type ContactFormState = {
  message: string;
  success: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    // A more detailed error message could be constructed from validatedFields.error.errors
    return {
      message: 'There was an error with your submission. Please check the fields and try again.',
      success: false,
    };
  }
  
  // Here you would typically send an email, save to a database, etc.
  // For this example, we'll just log it to the console.
  console.log('New contact form submission:');
  console.log(validatedFields.data);

  return {
    message: "Thanks for reaching out! I'll get back to you soon.",
    success: true,
  };
}
