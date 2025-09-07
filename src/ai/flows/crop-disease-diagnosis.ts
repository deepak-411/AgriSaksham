// src/ai/flows/crop-disease-diagnosis.ts
'use server';

/**
 * @fileOverview Diagnoses plant diseases or pest infestations from an image.
 *
 * - diagnoseCropDisease - A function that handles the crop disease diagnosis process.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type DiagnoseCropDiseaseInput = z.infer<typeof DiagnoseCropDiseaseInputSchema>;

const DiagnoseCropDiseaseOutputSchema = z.object({
  disease: z
    .string()
    .describe(
      'The name of the identified disease or pest, or null if none are found.'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score between 0 and 1 indicating the certainty of the diagnosis.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for treatment and prevention of the identified disease or pest.'
    ),
});
export type DiagnoseCropDiseaseOutput = z.infer<typeof DiagnoseCropDiseaseOutputSchema>;

export async function diagnoseCropDisease(
  input: DiagnoseCropDiseaseInput
): Promise<DiagnoseCropDiseaseOutput> {
  return diagnoseCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: {schema: DiagnoseCropDiseaseInputSchema},
  output: {schema: DiagnoseCropDiseaseOutputSchema},
  prompt: `You are an AI assistant that specializes in diagnosing crop diseases and pest infestations from images.

  Analyze the image of the crop provided and identify any potential diseases or pests.
  Provide a confidence score indicating the certainty of the diagnosis and recommendations for treatment and prevention.
  If no disease or pest is found, indicate that the crop appears healthy.

  Photo: {{media url=photoDataUri}}
  `,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropDiseaseInputSchema,
    outputSchema: DiagnoseCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
