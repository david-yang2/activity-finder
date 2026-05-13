import "dotenv/config";
import OpenAI from "openai";
import { getWeatherByCity, tools } from "./helperFunctions.js";

// JSON Schema for getWeatherModel output

export const getWeatherModel = async (query) => {
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

    DO NOT suggest activities.
    DO NOT add extra information.
    DO NOT explain anything.

    Return ONLY one single sentence.

    Format:
    "<original user query> it's <temperature summary>"

    Examples:

    User: What should I do in Los Angeles this weekend?
    Output:
    "What should I do in Los Angeles this weekend? it's a high of 76°F on Saturday and 75.6°F on Sunday, with lows of 62.1°F and 63°F."

    User: What is the weather in Los Angeles today?
    Output:
    "What is the weather in Los Angeles today? it's 74°F."

    Rules:
    - Output must be ONE sentence only
    - No lists
    - No recommendations
    - No extra paragraphs
    - No line breaks

    
    You cycle through Thought, Action, PAUSE, obersavation. At the end of the loop, you will output a final Answer. 
    
    1. Thought: Describe your thoughts about the question you have been asked. 
    2. Action: getWeatherByLocation: Los Angeles, today
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
  
  console.log(query);
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

    const { finish_reason: finishReason, message } = response.choices[0];
    const { tool_calls: toolCalls } = message;

    messages.push(message);

    if (finishReason === "stop") {
      console.log(message);
      return message.content;
    } else if (finishReason === "tool_calls") {
      for (const toolCall of toolCalls) {
        console.log("this is ", i, message);
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        console.log(
          "this is the function name",
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
