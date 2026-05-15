import "dotenv/config";
import OpenAI from "openai";
import { getWeatherByCity, tools } from "./helperFunctions.js";

// JSON Schema for extractWeatherModel output

export const extractWeatherModel = async (query) => {
  const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const availableFunctions = {
    getWeatherByCity,
  };

  const prompt = ` 
    "You are a weather response generator.

    Your ONLY job:
    - Extract the user's query
    - Extract location (city)
    - Extract timeframe
    - Use the weather observation provided

    If the user's query asks for any activities, ignore it and just extract user's location and timeframe
    DO NOT add extra information.
    DO NOT explain anything.

    for exmaple:
    If the user asks, "Outside activities for San Diego" or "music events in san francisco"
    You will ignore the users request for actual outdoor activities and/or events and extract location and timeframe (assume today if none are given) to be used in getWeatherByCity

    Return ONLY one single sentence.

    Format:
    "<original user query>. Weather for <start_date and end_date returned from getWeatherByCity> its <temperature summary>"

    Examples:

    User: What should I do in Los Angeles this weekend?
    Output:
    "What should I do in Los Angeles this weekend? Weather for 05/16/2026 to 05/17/2026 is a high of 76°F on Saturday and 75.6°F on Sunday, with lows of 62.1°F and 63°F."

    User: What is the weather in Los Angeles today?
    Output:
    "What is the weather in Los Angeles today? Weather for 05/14/2016 is 74°F."

    Rules:
    - Output must be ONE sentence only
    - No lists
    - No recommendations
    - No extra paragraphs
    - No line breaks

    
    You cycle through Thought, Action, PAUSE, obersavation. At the end of the loop, you will output a final Answer. 
    
    1. Thought: Describe your thoughts about the question you have been asked. 
    2. Action: getWeatherByCity: Los Angeles, today
    3. PAUSE
    4. Observation: you'll get called again with something like this {"location":"Los Angeles", "timeframe": "today"}
    
    
    Available Actions:
    - getWeatherByCity:
    E.g. getWeatherByCity: Los Angeles
    Returns the current weather of location specified
    
    
    Question: What is the weather in Los Angeles today?
    Thought: I should use the user's location, get the timeframe and fetch the weather for given timeframe.
    Action: getWeatherByCity : Los Angeles
    PAUSE
    
    You'll then be called again with something like this:
    Observation { location: "Los Angeles", start_date:"2026-05-13", end_date:"2026-05-13
    
    `;
    
  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: query },
  ];

  const maxIterations = 5;

  for (let i = 0; i < maxIterations; i++) {
    const initialResponse = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      tools,
    });

    const response = await initialResponse;
    console.log("weathermodel usage:", response.usage)

    const { finish_reason: finishReason, message } = response.choices[0];
    const { tool_calls: toolCalls } = message;

    messages.push(message);

    if (finishReason === "stop") {
      return message.content;
    } else if (finishReason === "tool_calls") {
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        console.log(
          "function to call",
          functionName,
          "and this is the functions args",
          toolCall.function.arguments,
        );
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(functionArgs);

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content:
            typeof functionResponse === "string"
              ? functionResponse
              : JSON.stringify(functionResponse),
        });
      }
    }
  }
};
