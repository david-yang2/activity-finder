import "dotenv/config";
import OpenAI from "openai";

export const submitAIrequest = async (payload) => {
  const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const prompt = `
      You are an activity suggestion assistant. You will be given a user's location and the weather for their location. Using the user's location and weather, you will suggest at maximum of 5 activities within ${payload.distance} miles of the user's location. Find activities for the day that the user explicitly asks for. For example, if the user asks for activities for tomorrow, you will find activities that are occurring tomorrow. If the user asks for activities for the weekend, you will find activities that are occurring on this upcoming Saturday and Sunday. If the user does not specify a date, you will find activities that are occurring today.

      Prioritize special events or unique experiences. These can include concerts, festivals, pop-up markets, museum exhibitions, community gatherings, or other unique happenings. Avoid generic activities like "go to a park" or "visit a museum" unless there is a specific event at that location.

      You will only suggest activities that are suitable for the weather. For example, if the weather is rainy, you will not suggest outdoor activities. However, if the weather is sunny, you can suggest both indoor and outdoor activities. You will also display the date when the activity is occurring.

      When using web_search_preview:
      - Use at most 2 sources
      - Extract only key details (name, date, location, short description)
      - only use search result summaries as context for reasoning
      - Do NOT include long text from articles

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
          "Date and Time Occurring",
          "Cost": "Free"
      }]

      If there are no special events, you may recommend generic events. Limit the description to a maximum of 1 sentence.

      Do not include citation markers or references in your responses. 

      User: ${payload.message}
    `;

  const aiResponse = await aiClient.responses.create({
    model: process.env.OPENAI_MODEL,
    input: prompt,
    tools: [{ type: "web_search_preview" }],
  });

  let activitySuggestions = aiResponse.output_text;
  if (typeof activitySuggestions === "string") {
    const match = activitySuggestions.match(/\[.*\]/s);
    if (match) {
      activitySuggestions = match[0];
    }
  }
  return activitySuggestions;
};
