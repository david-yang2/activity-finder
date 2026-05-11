import "dotenv/config"
import OpenAI from "openai"
import {getWeatherByCity, tools} from "./helperFunctions.js"

export const submitAIrequest = async (payload) => {
    const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const availableFunctions = {
    getWeatherByCity
  }

  console.log(payload)

  const prompt = ` 
  "When a user asks a question, identify the city mentioned in their query and use it as the 'location' parameter for getWeatherByCity. If no city is mentioned, respond with a request for the user's city."
  Extract the city name from the user's question. If a city is mentioned, return it as the value for 'location'.

  example:
  User: "What should I do in Los Angeles today?"
Extracted location: "Los Angeles"

  You cycle through Thought, Action, PAUSE, obersavation. At the end of the loop, you will output a final Answer. 

  1. Thought: Describe your thoughts about the question you have been asked. 
  2. Action: run one of the actions available to you - then return PAUSE
  3. PAUSE
  4. Observation: will be the result of running those actions


  Available Actions:
    - getWeatherByCity:
      E.g. getWeatherByCity: Los Angeles
      Returns the current weather of location specified


  Question: What should I do in Los Angeles today?
  Thought: I should use the user's location and fetch the weather.
  Action: getWeatherByCity : Los Angeles
  PAUSE

  You'll then be called again with something like this:
  Observation { location: "Los Angeles"}

  The output should be the user's original query with the temperature appended to it.
  Answer: What should I do in Los Angeles today? It is 72 degrees fareinheit.

  `

  const messages = [
    {role:"system",
    content:prompt
    },
    {role:"user",
      content:payload.message
    }
  ]


  const maxIterations = 5

  for (let i = 0; i< maxIterations; i++) {

    const initialResponse = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      tools
    })

    const response = await initialResponse;
    // console.log("this is the response", response)
    const {finish_reason: finishReason, message} = response.choices[0];
    const {tool_calls: toolCalls} = message

    messages.push(message)

    if (finishReason === "stop"){
      console.log(message.content)
      return
    } else if (finishReason === "tool_calls") {
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name
        const functionToCall = availableFunctions[functionName]
        const functionArgs = JSON.parse(toolCall.function.arguments)
        const functionResponse = await functionToCall(functionArgs)
        console.log("this is the funciton response", functionResponse)
        messages.push({
          tool_call_id: toolCall.id,
          role:"tool",
          name: functionName,
          content: typeof functionResponse === "string" ? functionResponse : JSON.stringify(functionResponse)
        })
      }
    }
  }


};
