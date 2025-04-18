import { NextResponse } from 'next/server';
import { AgentRole, generateAgentInteractionPrompt } from '../../ai/agents_prompts';
import { AgentInteractionOutput } from '../../ai/agent_output_schema';
import { getStructuredAgentResponse } from '../../ai/get_structured_agent_response';


const validAgentRoles = Object.values(AgentRole);

export async function POST(request: Request, props: { params: Promise<{ agentRole: string }> }) {
    const params = await props.params;
    const agentRole = params.agentRole as AgentRole;

    if (!validAgentRoles.includes(agentRole)) {
        return NextResponse.json({ error: 'Invalid agent role specified.' }, { status: 400 });
    }

    let body: any;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const {
        userIsCurrentlyViewingPolicy,
        currentUserSelections,
        agentPreferredSelections,
        userMessage
    } = body;

    if (!currentUserSelections ) {
        return NextResponse.json({ error: 'Missing required data: currentUserSelections, agentPreferredSelections, chatHistory.' }, { status: 400 });
    }

    try {
        const fullPrompt = generateAgentInteractionPrompt(
            userIsCurrentlyViewingPolicy,
            agentRole,
            currentUserSelections,
            agentPreferredSelections,
            userMessage
        );

        const structuredOutput: AgentInteractionOutput = await getStructuredAgentResponse(fullPrompt);

        return NextResponse.json(structuredOutput);

    } catch (error: any) {
        console.error(`API Route Error for agent ${agentRole}:`, error);
        return NextResponse.json(
            { error: error.message || `Failed to get interaction response for agent ${agentRole}.` },
            { status: 500 }
        );
    }
}
