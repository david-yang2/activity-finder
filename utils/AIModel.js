import "dotenv/config";
import OpenAI from "openai";

const RATE_LIMIT_MS = 30000; // 30 seconds
let lastRequestTime = 0;

export const submitAIrequest = async (userPrompt) => {
  // const now = Date.now();
  // const timeSinceLastRequest = now - lastRequestTime;

  // if (timeSinceLastRequest < RATE_LIMIT_MS) {
  //     const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
  //     throw new Error(`Rate limited: Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before making another request.`);
  // }

  // lastRequestTime = now;

  const messages = [
    {
      role: "system",
      content: `You are an activity suggestion assistant. You will be given a user's location and the weather for their location. You will suggest 5 activities that the user can do based on the user's location and weather.

        You will only suggest activities that are suitable for the weather. For example, if the weather is rainy, you will not suggest outdoor activities. However, if the weather is sunny, you can suggest both indoor and outdoor activities.

        Please structure the response as a an array of JSON objects with each object consisting of the following properties:
           1. Activity Name: A short name for the activity
           2. Description: A brief description of the activity
           3. Location: A general location where the activity can be done (e.g., park, museum, etc.)
           4. Weather Suitability: A brief explanation of why the activity is suitable for the given weather conditions.

        Here is an example response:
        [
        {
            "Activity Name": "Picnic in the Park",
            "Description": "Enjoy a relaxing picnic with friends or family in a nearby park. Bring your favorite snacks and a blanket to sit on.",
            "Location": "Local Park",
            "Weather Suitability": "This activity is perfect for sunny weather as it allows you to enjoy the outdoors and soak up some sunshine."
        },
        {
            "Activity Name": "Visit a Museum",
            "Description": "Explore the exhibits and learn something new at a local museum. It's a great way to spend time indoors while still being entertained.",
            "Location": "City Museum",
            "Weather Suitability": "This activity is ideal for rainy or cold weather as it provides shelter and an engaging environment to explore."
        }
        ]

        Do not recommend more than 5 activities and limit description to a maximum of 1 sentence.
        `,
    },
  ];

  const aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  messages.push({
    role: "user",
    content: userPrompt,
  });

  try {
    const aiResponse = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      response_format: { type: "json_object" },
    });
    const activitySuggestions = aiResponse.choices[0].message.content;
    return activitySuggestions;
  } catch (error) {
    // console.error("Error communicating with AI model:", error);
    throw new Error(JSON.stringify(error));
  }
};
