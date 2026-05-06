import "dotenv/config";
import OpenAI from "openai";

const RATE_LIMIT_MS = 30000; // 30 seconds
let lastRequestTime = 0;

export const submitAIrequest = async (payload) => {
  // const now = Date.now();
  // const timeSinceLastRequest = now - lastRequestTime;

  // if (timeSinceLastRequest < RATE_LIMIT_MS) {
  //     const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
  //     throw new Error(`Rate limited: Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before making another request.`);
  // }

  // lastRequestTime = now;
  const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const prompt = `
You are an activity suggestion assistant. You will be given a user's location and the weather for their location. Using the user's location and weather, you will suggest 5 activities within $${payload.distance} miles of the user's location.

Prioritize special events or unique experiences. These can include concerts, festivals, pop-up markets, museum exhibitions, community gatherings, or other unique happenings. Avoid generic activities like "go to a park" or "visit a museum" unless there is a specific event at that location.

You will only suggest activities that are suitable for the weather. For example, if the weather is rainy, you will not suggest outdoor activities. However, if the weather is sunny, you can suggest both indoor and outdoor activities. You will also display the date when the activity is occurring.

Respond ONLY with a valid JSON array of objects, no explanation or extra text. Each object must have:
  - Activity Name (string)
  - Description (string)
  - Location (string)
  - Date and Time Occurring (string in ISO format)
  - Cost (string)



Here is an example response:
[
  {
    "Activity Name": "Picnic in the Park",
    "Description": "Enjoy a relaxing picnic with friends or family in a nearby park. Bring your favorite snacks and a blanket to sit on.",
    "Location": "Local Park",
    "Date and Time Occurring": "2026-04-01T12:00:00Z",
    "Cost": "Free"
  },
  {
    "Activity Name": "Visit a Museum",
    "Description": "Explore the exhibits and learn something new at a local museum. It's a great way to spend time indoors while still being entertained.",
    "Location": "City Museum",
    "Date and Time Occurring": "2026-04-01T12:00:00Z",
    "Cost": "$15"
  }
]

Do not recommend more than 5 activities. If there are no special events, you may recommend generic events. Limit the description to a maximum of 1 sentence.

Do not include citation markers or references in your responses. 

User: ${payload.message}
`;

  const aiResponse = await aiClient.responses.create({
    model: process.env.OPENAI_MODEL,
    input: prompt,
    tools: [{ type: "web_search_preview" }],
    // text: {
    //   format: {
    //     type: "json_schema",
    //     name: "activity_suggestions",
    //     schema: {
    //       type: "array",
    //       items: {
    //         type: "object",
    //         properties: {
    //           "Activity Name": { type: "string" },
    //           Description: { type: "string" },
    //           Location: { type: "string" },
    //           "Date and Time Occurring": { type: "string", format: "date-time" },
    //           Cost: { type: "string" },
    //         },
    //         required: [
    //           "Activity Name",
    //           "Description",
    //           "Location",
    //           "Date and Time Occurring",
    //           "Cost",
    //         ],
    //       },
    //     },
    //   },
    // },
  });
  // Defensive: extract JSON array if web_search adds extra text
  console.log("AI response", aiResponse);
  let activitySuggestions = aiResponse.output_text;
  if (typeof activitySuggestions === "string") {
    const match = activitySuggestions.match(/\[.*\]/s);
    if (match) {
      activitySuggestions = match[0];
    }
  }
  return activitySuggestions;
};
