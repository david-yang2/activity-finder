import 'dotenv/config';
import OpenAI from "openai";



const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
})