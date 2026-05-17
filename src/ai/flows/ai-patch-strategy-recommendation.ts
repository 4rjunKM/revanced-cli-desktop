'use server';
/**
 * @fileOverview An AI agent that analyzes an APK version and suggests relevant ReVanced patches.
 *
 * - suggestPatchStrategy - A function that handles the patch strategy recommendation process.
 * - AiPatchStrategyRecommendationInput - The input type for the suggestPatchStrategy function.
 * - AiPatchStrategyRecommendationOutput - The return type for the suggestPatchStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPatchStrategyRecommendationInputSchema = z.object({
  apkVersion: z
    .string()
    .describe(
      'The version string of the Android APK (e.g., "2.22.1", "18.0.32").'
    ),
});
export type AiPatchStrategyRecommendationInput = z.infer<
  typeof AiPatchStrategyRecommendationInputSchema
>;

const AiPatchStrategyRecommendationOutputSchema = z.object({
  recommendedPatches: z
    .array(
      z.object({
        patchName: z.string().describe('The name of the recommended ReVanced patch.'),
        description: z
          .string()
          .describe('A brief description of what the patch does.'),
        recommendationReason: z
          .string()
          .describe(
            'Why this patch is recommended based on the APK version and community feedback.'
          ),
        stability: z
          .enum(['stable', 'beta', 'experimental'])
          .describe('The stability level of the patch.'),
      })
    )
    .describe('A list of recommended ReVanced patches.'),
});
export type AiPatchStrategyRecommendationOutput = z.infer<
  typeof AiPatchStrategyRecommendationOutputSchema
>;

export async function suggestPatchStrategy(
  input: AiPatchStrategyRecommendationInput
): Promise<AiPatchStrategyRecommendationOutput> {
  return aiPatchStrategyRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPatchStrategyRecommendationPrompt',
  input: {schema: AiPatchStrategyRecommendationInputSchema},
  output: {schema: AiPatchStrategyRecommendationOutputSchema},
  prompt: `You are an expert in ReVanced patching, specializing in recommending the most stable and useful patches for specific Android APK versions, based on current community feedback and known compatibilities.

Analyze the provided APK version and suggest a list of relevant ReVanced patches. For each patch, provide its name, a brief description, the reason for its recommendation (considering stability and community feedback), and its stability level (stable, beta, or experimental).

If you cannot find specific patch recommendations for the given APK version, still provide a general recommendation of common patches that are usually stable across many versions, and explain why they are generally useful.

APK Version: {{{apkVersion}}}`,
});

const aiPatchStrategyRecommendationFlow = ai.defineFlow(
  {
    name: 'aiPatchStrategyRecommendationFlow',
    inputSchema: AiPatchStrategyRecommendationInputSchema,
    outputSchema: AiPatchStrategyRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
