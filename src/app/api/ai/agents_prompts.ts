import { BASE_GAME_KNOWLEDGE, CITIZEN_AGENT_PROMPT_INSTRUCTIONS, HUMAN_RIGHTS_AGENT_PROMPT_INSTRUCTIONS, STATE_AGENT_PROMPT_INSTRUCTIONS } from "./agents_knowledge_bases";

export enum AgentRole {
    STATE = 'state',
    CITIZEN = 'citizen',
    HUMAN_RIGHTS = 'human_rights',
}


const getRoleInstructions = (role: AgentRole): string => {
    switch (role) {
        case AgentRole.STATE: return STATE_AGENT_PROMPT_INSTRUCTIONS;
        case AgentRole.CITIZEN: return CITIZEN_AGENT_PROMPT_INSTRUCTIONS;
        case AgentRole.HUMAN_RIGHTS: return HUMAN_RIGHTS_AGENT_PROMPT_INSTRUCTIONS;
        default: throw new Error(`Invalid agent role: ${role}`);
    }
};



export const generateAgentInteractionPrompt = (
    userIsCurrentlyViewingPolicy: string,
    agentRole: AgentRole,
    userSelectionsText: string,
    agentPrefText: string | null,
    userMessage?: string
): string => {

    const roleInstructions = getRoleInstructions(agentRole);

    let taskDescription = `
**Task:** You are the ${agentRole} agent. Analyze the user's current policy selections compared to your preferred package. Then, respond to the user.

${agentPrefText ? `Your Preferred Policies:
        So far, you have decided these to be your selections: ${agentPrefText}
        ` : ""}

User's Current Policies:
${userSelectionsText}`;
    
    if (userIsCurrentlyViewingPolicy) {
        taskDescription += `\n\nUser is currently viewing & deliberating on policy: ${userIsCurrentlyViewingPolicy}`;
    }



    if (userMessage && userMessage.trim().length > 0) {
        taskDescription += `\n\nUser's Message: ${userMessage}`;
        taskDescription += `\nInstructions: Generate a response considering the user's message, your role's priorities, the current policy selections, and your preferred policies. Your response MUST include:`;
    } else {
        taskDescription += `\n\nInstructions: Generate a response reflecting on the user's current policy selections based on your role's priorities and your preferred policies. Your response MUST include:`;
    }

    taskDescription += `
1.  'happiness': A numerical score (0.0-1.0) reflecting your satisfaction with the USER'S CURRENT selections.
2.  'overallPovStatement': A brief, persuasive statement (max 4 lines) summarizing your view of the user's package from your role's perspective. Aim to influence the user towards your preferred options (Keep it concise, max 1-3 sentences / 240 characters).
3.  'specificResponse': ${userMessage ? "A direct response to the user's last message." : "A comment on the user's current selections or the latest change, if known."} (Keep it concise, max 1-3 sentences / 240 characters).
4.   'yourPackageSelections' : ${agentPrefText ? "Do not change them easily. User must convince you" : "Specify your preferred policy selections based on your role's priorities. (Keep it concise)"}

Output ONLY the single, minified, valid JSON object matching the AgentInteractionOutputSchema. Adhere strictly to your persona and constraints. Think step-by-step internally based on the base game knowledge and your specific role instructions before generating the JSON.
`;

    const fullPrompt = `${BASE_GAME_KNOWLEDGE}\n\n${roleInstructions}\n\n${taskDescription}`;
    return fullPrompt;
};