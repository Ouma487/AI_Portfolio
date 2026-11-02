'use server';

import { z } from 'zod';
import { Resend } from 'resend';

// The sender address. `onboarding@resend.dev` works without a verified domain,
// but Resend then only delivers to the email of your own Resend account.
// After verifying a domain in Resend, change this to e.g. `contact@yourdomain.com`.
const FROM_ADDRESS = 'Portfolio Contact <onboarding@resend.dev>';

const MAX_SUBJECT_LENGTH = 120;

const GENERIC_ERROR =
  'Something went wrong while sending your message. Please try again later, or email me directly.';

const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be 100 characters or fewer' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(254, { message: 'Email is too long' })
    .email({ message: 'Invalid email address' }),
  // Optional: an empty string is fine, anything else must be an http(s) URL.
  website: z
    .union([
      z.literal(''),
      z
        .string()
        .trim()
        .max(2048, { message: 'Website URL is too long' })
        .url({ message: 'Please enter a valid URL (e.g. https://example.com)' })
        .refine((value) => /^https?:\/\//i.test(value), {
          message: 'Website must start with http:// or https://',
        }),
    ])
    .optional(),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(5000, { message: 'Message must be 5000 characters or fewer' }),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    website?: string[];
    message?: string[];
  };
  success: boolean;
};

/** Escape the five characters that have special meaning in HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Remove line breaks (header injection) and cap the length of the subject. */
function sanitizeSubject(value: string): string {
  const singleLine = value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  return singleLine.length > MAX_SUBJECT_LENGTH
    ? `${singleLine.slice(0, MAX_SUBJECT_LENGTH - 1)}…`
    : singleLine;
}

/** FormData.get returns null for missing fields; zod expects undefined. */
function field(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === 'string' ? value : undefined;
}

// Built on first use rather than at import time, so a missing key produces a
// clear server-side log and a friendly message instead of a crash.
let resendClient: Resend | null = null;
function getResend(apiKey: string): Resend {
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot: real visitors never see the "company" field, bots often fill it.
  // Pretend it worked so the bot has no signal to adapt to.
  const honeypot = field(formData, 'company');
  if (honeypot && honeypot.trim() !== '') {
    return {
      message: 'Your message has been sent successfully!',
      success: true,
    };
  }

  const validatedFields = contactSchema.safeParse({
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    website: field(formData, 'website'),
    message: field(formData, 'message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please fix the highlighted fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!apiKey || !contactEmail) {
    console.error(
      `Contact form is not configured: missing ${[
        !apiKey && 'RESEND_API_KEY',
        !contactEmail && 'CONTACT_EMAIL',
      ]
        .filter(Boolean)
        .join(' and ')}.`
    );
    return {
      message:
        'The contact form is temporarily unavailable. Please email me directly instead.',
      success: false,
    };
  }

  const { name, email, website, message } = validatedFields.data;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeWebsite = website ? escapeHtml(website) : '';
  const safeMessage = escapeHtml(message);

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
        New message from your portfolio
      </h2>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> ${safeEmail}</p>
      ${
        safeWebsite
          ? `<p style="margin: 8px 0;"><strong>Website:</strong> ${safeWebsite}</p>`
          : ''
      }
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #ccc;">
        <p style="margin-bottom: 6px; font-weight: bold;">Message:</p>
        <p style="white-space: pre-line;">${safeMessage}</p>
      </div>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #000;" />
      <p style="font-size: 12px; color: #666;">
        Sent automatically from your <strong>Portfolio Contact Form</strong>.
      </p>
    </div>
  `;

  // Plain-text version: no HTML, so no escaping needed. Many mail clients and
  // spam filters prefer messages that include one.
  const text = [
    'New message from your portfolio',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    ...(website ? [`Website: ${website}`] : []),
    '',
    'Message:',
    message,
  ].join('\n');

  try {
    // resend.emails.send() does not throw on API errors (bad key, unverified
    // recipient, rate limit...). It returns { data, error }, so check error.
    const { error } = await getResend(apiKey).emails.send({
      from: FROM_ADDRESS,
      to: contactEmail,
      replyTo: email,
      subject: sanitizeSubject(`New message from ${name}`),
      html,
      text,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { message: GENERIC_ERROR, success: false };
    }

    return {
      message: 'Your message has been sent successfully!',
      success: true,
    };
  } catch (error) {
    // Network failures and other unexpected exceptions still throw.
    console.error('Unexpected error while sending contact email:', error);
    return { message: GENERIC_ERROR, success: false };
  }
}
