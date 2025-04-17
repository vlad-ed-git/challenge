

import { NextResponse } from 'next/server';
import { GAME_KNOWLEDGE_BASE_FOR_HELPER } from '../ai/ai_helper_knowledge';
import { getHelpFromMyAi } from '../ai/send_ai_message';


export async function POST(request: Request) {


    try {
        const body = await request.json();
        const { messageText, context } = body;


        if (!messageText || typeof messageText !== 'string' || !context || typeof context !== 'string') {
            console.error("API Route Error: Invalid request body.", body);
            return NextResponse.json({ error: 'Invalid request body: Missing messageText or context.' }, { status: 400 });
        }


        const fullPrompt = `${GAME_KNOWLEDGE_BASE_FOR_HELPER}\n\n${context}\n\nUser Question: ${messageText}\n\nAI Helper Response:`;



        const response = await getHelpFromMyAi(
            fullPrompt,
        );

        const responseText = response;



        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("API Route Error processing AI request:", error);

        return NextResponse.json(
            { error: error.message || 'Failed to get response from AI Helper.' },
            { status: 500 }
        );
    }
}

