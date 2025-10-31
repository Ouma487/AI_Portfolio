'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  website: z.string().optional(),
  message: z.string().min(1, { message: 'Message is required' }),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    website: formData.get('website'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, email, website, message } = validatedFields.data;

  try {
    // 🖤 HTML Email Template
    const html = `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #000;
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      ">
        <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 16px;">
          📬 New message from your portfolio
        </h2>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        ${
          website
            ? `<p style="margin: 8px 0;"><strong>Website:</strong> ${website}</p>`
            : ''
        }
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #ccc;">
          <p style="margin-bottom: 6px; font-weight: bold;">Message:</p>
          <p style="white-space: pre-line;">${message}</p>
        </div>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #000;" />
        <p style="font-size: 12px; color: #666;">
          Sent automatically from your <strong>Portfolio Contact Form</strong>.
        </p>
      </div>
    `;

    // 📨 Send the email
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // keep this default domain
      to: process.env.CONTACT_EMAIL as string, // your inbox
      subject: `New message from ${name}`,
      html, // send HTML instead of plain text
    });

    return {
      message: 'Your message has been sent successfully!',
      success: true,
    };
  } catch (error) {
    console.error('Resend email error:', error);
    return {
      message:
        'Something went wrong while sending your message. Please try again later.',
      success: false,
    };
  }
}
