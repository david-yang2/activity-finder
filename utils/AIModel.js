import 'dotenv/config';
import OpenAI from "openai";

const RATE_LIMIT_MS = 30000; // 30 seconds
let lastRequestTime = 0;

export const submitAIrequest = async (userPrompt) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
        const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
        throw new Error(`Rate limited: Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before making another request.`);
    }
    
    lastRequestTime = now;

    const aiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL,
    })

    const aiResponse = await aiClient.responses.create({
        model:process.env.OPENAI_MODEL,
        input:[{
            role:"user",
            content:userPrompt
        }]
    })

    console.log(aiResponse.output_text);
}