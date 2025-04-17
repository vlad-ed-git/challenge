import { z } from "zod";

export const AgentInteractionOutputSchema = z.object({
    happiness: z
        .number()
        .min(0)
        .max(1)
        .describe(
            "Happiness score from 0.0 (completely dissatisfied) to 1.0 (fully satisfied) based on alignment with user's current selections."
        ),
    overallPovStatement: z
        .string()
        .describe(
            "Brief persuasive statement (max 4 lines / ~250 chars) reflecting overall view of user's current selections based on agent role."
        ),
    specificResponse: z
        .string()
        .describe(
            "Response to the user's last message IF SENT OR reaction to the most recent policy selection change by the user."
    ),
    yourPackageSelections: z
        .string()
        .describe(
            "The agent's preferred policy selections based on their role's priorities. This must be set ONCE and never changed."
        ),
});

export type AgentInteractionOutput = z.infer<typeof AgentInteractionOutputSchema>;