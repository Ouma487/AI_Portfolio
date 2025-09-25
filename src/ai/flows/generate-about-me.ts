'use server';

/**
 * @fileOverview A flow for generating a personalized 'About Me' section based on user input and specified tone.
 *
 * - generateAboutMe - A function that handles the generation of the 'About Me' section.
 * - GenerateAboutMeInput - The input type for the generateAboutMe function.
 * - GenerateAboutMeOutput - The return type for the generateAboutMe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutMeInputSchema = z.object({
  userInput: z
    .string()
    .describe('User-provided information to be included in the About Me section.'),
  tone: z
    .string()
    .describe(
      'The desired tone for the About Me section (e.g., professional, casual).' 
    ),
});
export type GenerateAboutMeInput = z.infer<typeof GenerateAboutMeInputSchema>;

const GenerateAboutMeOutputSchema = z.object({
  aboutMeText: z
    .string()
    .describe('The generated About Me section text, personalized based on input and tone.'),
});
export type GenerateAboutMeOutput = z.infer<typeof GenerateAboutMeOutputSchema>;

export async function generateAboutMe(input: GenerateAboutMeInput): Promise<GenerateAboutMeOutput> {
  return generateAboutMeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutMePrompt',
  input: {schema: GenerateAboutMeInputSchema},
  output: {schema: GenerateAboutMeOutputSchema},
  prompt: `You are a personal branding expert crafting compelling "About Me" sections.

  Based on the user's input and desired tone, generate a personalized "About Me" section.

  User Input: {{{userInput}}}
  Tone: {{{tone}}}

  Ensure the generated text is engaging, reflects the specified tone, and highlights the user's key attributes.
  `,
});

const generateAboutMeFlow = ai.defineFlow(
  {
    name: 'generateAboutMeFlow',
    inputSchema: GenerateAboutMeInputSchema,
    outputSchema: GenerateAboutMeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
