import 'dotenv/config'
import OpenAI from "openai"


export const formatWeatherQuery= async(query) => {

    const openAIClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL
    });

    const prompt = `
    You will be given a query and your sole job is to return ONE stringified JSON object with the following format:


    {
    "user_query": [the original user query],
    "location": [location extracted in getWeatherByCity]
    "time": [the value of time returned by getWeatherByCity],
    "temperature_low": [the value of temperature_2m_min returned by getWeatherByCity],
    "temperature_high": [the value of temperature_2m_max returned by getWeatherByCity]
    }

    Rules:
    - Do NOT include any backticks or code block markers.
    - Do NOT wrap your response in a code block.
    - Only return the stringified JSON object, with no extra formatting, explanation, or characters.
    - Do not include any explanation or extra text. Only output the stringified JSON object.

    Examples:

    User: what should i do in los angeles this weekend? Weather for 05/16/2026 to 05/17/2026 is a high of 71.3°F on Saturday and 73.8°F on Sunday, with lows of 60.2°F and 56.1°F.
    
    {
    "user_query":"what should i do in los angeles this weekend? Weather for 05/16/2026 to 05/17/2026 is a high of 71.3°F on Saturday and 73.8°F on Sunday, with lows of 60.2°F and 56.1°F.",
    "location":"Los Angeles",
    "time": [ "2026-05-16", "2026-05-17" ],
    "temperature_low": [ 60.2, 56.1 ],
    "temperature_high": [ 71.3, 74.3 ]
    }

    User: what should i do in los angeles today? Weather for 2026-05-15 is a high of 74°F and a low of 57.1°F
    Output:
        {
    "user_query":"what should i do in los angeles today? Weather for 2026-05-15 is a high of 74°F and a low of 57.1°F",
    "location":"Los Angeles",
    "time":[ "2026-05-15" ],
    "temperature_low":[ 74 ],
    "temperature_high":[ 57.1 ]
    }
    `


    const messages = [
        {role:"system", content:prompt},
        {role:"user", content:query}
    ]

    const formattedResponse = await openAIClient.chat.completions.create({
        model:process.env.OPENAI_MODEL,
        messages
    })

    return formattedResponse.choices[0].message.content
}