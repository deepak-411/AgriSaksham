// Implemented voice-based AI assistant flow to provide farmers with the latest market prices for their crops in their local dialect.

'use server';
/**
 * @fileOverview A voice-based AI assistant for farmers to get the latest market prices.
 *
 * - getMarketPrice - A function that handles the market price retrieval process.
 * - GetMarketPriceInput - The input type for the getMarketPrice function.
 * - GetMarketPriceOutput - The return type for the getMarketPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketPriceInputSchema = z.object({
  crop: z.string().describe('The crop for which to get the market price.'),
  dialect: z.string().describe('The local dialect of the farmer.'),
});
export type GetMarketPriceInput = z.infer<typeof GetMarketPriceInputSchema>;

const GetMarketPriceOutputSchema = z.object({
  marketPrice: z.string().describe('The latest market price for the crop.'),
  speech: z.string().describe('The speech response in the local dialect.'),
});
export type GetMarketPriceOutput = z.infer<typeof GetMarketPriceOutputSchema>;

export async function getMarketPrice(input: GetMarketPriceInput): Promise<GetMarketPriceOutput> {
  return getMarketPriceFlow(input);
}

const getMarketPricePrompt = ai.definePrompt({
  name: 'getMarketPricePrompt',
  input: {schema: GetMarketPriceInputSchema},
  output: {schema: GetMarketPriceOutputSchema},
  prompt: `You are a helpful AI assistant for farmers. A farmer will ask for market prices for their crops, and you will provide the latest market price in their local dialect.

Crop: {{{crop}}}
Dialect: {{{dialect}}}

Market Price:`,
});

const getMarketPriceFlow = ai.defineFlow(
  {
    name: 'getMarketPriceFlow',
    inputSchema: GetMarketPriceInputSchema,
    outputSchema: GetMarketPriceOutputSchema,
  },
  async input => {
    const {output} = await getMarketPricePrompt(input);
    // call TTS and return audio
    return output!;
  }
);
