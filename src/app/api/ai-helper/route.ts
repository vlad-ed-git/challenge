

import { NextResponse } from 'next/server';
import { GAME_KNOWLEDGE_BASE } from '../ai/ai_helper_knowledge';
import { getHelpFromMyAi } from '../ai/send_ai_message';


export async function POST(request: Request) {
    console.log("API Route /api/ai-helper received POST request.");

    try {
        const body = await request.json();
        const { messageText, context } = body;


        if (!messageText || typeof messageText !== 'string' || !context || typeof context !== 'string') {
            console.error("API Route Error: Invalid request body.", body);
            return NextResponse.json({ error: 'Invalid request body: Missing messageText or context.' }, { status: 400 });
        }


        const fullPrompt = `${GAME_KNOWLEDGE_BASE}\n\n${context}\n\nUser Question: ${messageText}\n\nAI Helper Response:`;
        console.log("API Route: Sending prompt to AI...");


        const response = await getHelpFromMyAi(
            fullPrompt,
        );

        const responseText = response;
        console.log("API Route: Received AI response.");


        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("API Route Error processing AI request:", error);

        return NextResponse.json(
            { error: error.message || 'Failed to get response from AI Helper.' },
            { status: 500 }
        );
    }
}

