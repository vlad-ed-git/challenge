import { z } from 'zod';
import ai from './config';
import { AgentInteractionOutput, AgentInteractionOutputSchema } from './agent_output_schema';

export const getStructuredAgentResponse = async (
    fullPrompt: string
): Promise<AgentInteractionOutput> => {
    try {
        const result = await ai.generate({
            prompt: fullPrompt,
            output: {
                schema: AgentInteractionOutputSchema,
            },
            config: {
                temperature: 0.6,
            },
        });

        const outputData = result.output;

        if (!outputData) {
            throw new Error("AI returned empty or invalid structured output.");
        }

        return outputData;

    } catch (error) {
        console.error("Error calling Genkit generate for structured output:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod parsing error:", error.errors);
            throw new Error("AI response did not match the expected format.");
        }
        throw new Error("AI model interaction or parsing failed.");
    }
};