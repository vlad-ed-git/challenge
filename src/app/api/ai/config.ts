import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';


const ai = genkit({
    plugins: [googleAI()],
    model: gemini20Flash, 
});


export default ai;