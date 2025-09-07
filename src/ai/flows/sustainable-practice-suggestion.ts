// src/ai/flows/sustainable-practice-suggestion.ts
'use server';

/**
 * @fileOverview AI flow to analyze environmental data and suggest sustainable practices for water and soil conservation.
 *
 * - suggestSustainablePractices - A function that takes environmental data as input and returns sustainable practice suggestions.
 * - SustainablePracticeInput - The input type for the suggestSustainablePractices function.
 * - SustainablePracticeOutput - The return type for the suggestSustainablePractices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SustainablePracticeInputSchema = z.object({
  region: z.string().describe('The region or location of the farm.'),
  crops: z.string().describe('The crops being cultivated on the farm.'),
  soilType: z.string().describe('The type of soil on the farm.'),
  waterAvailability: z
    .string()
    .describe(
      'A description of the water availability in the region (e.g., abundant, scarce, seasonal).' 
    ),
  climate: z.string().describe('The climate of the region.'),
  environmentalDataUri: z
    .string()
    .describe(
      'A data URI containing environmental data for the region, that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type SustainablePracticeInput = z.infer<
  typeof SustainablePracticeInputSchema
>;

const SustainablePracticeOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of sustainable practices tailored to the region and crops for water and soil conservation.'
    ),
});
export type SustainablePracticeOutput = z.infer<
  typeof SustainablePracticeOutputSchema
>;

export async function suggestSustainablePractices(
  input: SustainablePracticeInput
): Promise<SustainablePracticeOutput> {
  return sustainablePracticeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sustainablePracticeSuggestionPrompt',
  input: {schema: SustainablePracticeInputSchema},
  output: {schema: SustainablePracticeOutputSchema},
  prompt: `You are an expert in sustainable agriculture practices.

  Based on the environmental data, region, crops, soil type, water availability and climate, suggest sustainable practices for water and soil conservation tailored to the region and crops.

  Region: {{{region}}}
  Crops: {{{crops}}}
  Soil Type: {{{soilType}}}
  Water Availability: {{{waterAvailability}}}
  Climate: {{{climate}}}
  Environmental Data: {{media url=environmentalDataUri}}

  Suggestions:`,
});

const sustainablePracticeSuggestionFlow = ai.defineFlow(
  {
    name: 'sustainablePracticeSuggestionFlow',
    inputSchema: SustainablePracticeInputSchema,
    outputSchema: SustainablePracticeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
