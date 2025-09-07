// Financial scheme advisory flow
'use server';
/**
 * @fileOverview An AI agent that suggests market linkages, microfinance options, and business opportunities for rural entrepreneurs.
 *
 * - getFinancialSchemeAdvisory - A function that gets financial scheme advisory.
 * - GetFinancialSchemeAdvisoryInput - The input type for the getFinancialSchemeAdvisory function.
 * - GetFinancialSchemeAdvisoryOutput - The return type for the getFinancialSchemeAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFinancialSchemeAdvisoryInputSchema = z.object({
  farmerDetails: z
    .string()
    .describe('Details about the farmer, including farm size, crops grown, income, and any existing loans.'),
  schemeDetails: z
    .string()
    .optional()
    .describe(
      'Details about specific financial schemes the farmer is interested in. Optional.'
    ),
});
export type GetFinancialSchemeAdvisoryInput = z.infer<typeof GetFinancialSchemeAdvisoryInputSchema>;

const GetFinancialSchemeAdvisoryOutputSchema = z.object({
  eligibleSchemes: z
    .string()
    .describe(
      'A list of government financial support schemes the farmer is eligible for, based on their details.'
    ),
  suggestedSchemes: z
    .string()
    .describe(
      'A list of government financial support schemes the agent suggests.'
    ),
});
export type GetFinancialSchemeAdvisoryOutput = z.infer<typeof GetFinancialSchemeAdvisoryOutputSchema>;

export async function getFinancialSchemeAdvisory(
  input: GetFinancialSchemeAdvisoryInput
): Promise<GetFinancialSchemeAdvisoryOutput> {
  return financialSchemeAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialSchemeAdvisoryPrompt',
  input: {schema: GetFinancialSchemeAdvisoryInputSchema},
  output: {schema: GetFinancialSchemeAdvisoryOutputSchema},
  prompt: `You are an AI assistant that provides information about government financial support schemes for farmers.

  Based on the farmer's details, suggest a list of schemes that the farmer is eligible for and a list of schemes that the agent suggests.

  Farmer Details: {{{farmerDetails}}}
  Scheme Details: {{{schemeDetails}}}
  `,
});

const financialSchemeAdvisoryFlow = ai.defineFlow(
  {
    name: 'financialSchemeAdvisoryFlow',
    inputSchema: GetFinancialSchemeAdvisoryInputSchema,
    outputSchema: GetFinancialSchemeAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
