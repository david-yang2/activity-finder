import { extractWeatherModel } from "./extractWeatherModel.js";
import { formatWeatherQuery } from "./formatWeatherQuery.js";
import { webSearchModel } from "./webSearchModel.js";
export const submitAIrequest = async (payload) => {

  // 1. model to extract dates and weather
  const queryWithWeather = await extractWeatherModel(payload.message);

  // 2. model to format the previous response (model did not respond well with tool calling and structured JSON response). 
  let formattedResponse, finalResponse, formatWeatherRaw;
  try {
    formatWeatherRaw = await formatWeatherQuery(queryWithWeather);
    formattedResponse = JSON.parse(formatWeatherRaw);
  } catch (err) {
    console.error("Error parsing model output in formatWeatherQuery. Raw output:", formatWeatherRaw);
    console.error(err);
    // Return a clear error object for the frontend and set a status property for Express
    const error = new Error("Invalid model output: not valid JSON");
    error.status = 500;
    throw error;
  }
  console.log(formattedResponse);

  // Defensive: check required properties
  if (!formattedResponse || !formattedResponse.user_query || !formattedResponse.time || !formattedResponse.temperature_low || !formattedResponse.temperature_high) {
    const error = new Error("Model output missing required fields");
    error.status = 500;
    throw error;
  }

  // 3 web search for solutions
  finalResponse = await webSearchModel(
    formattedResponse.user_query,
    payload.distance,
  );

  const finalResponseObj = {
    suggestions: JSON.parse(finalResponse),
    location: formattedResponse.location,
    dates: formattedResponse.time,
    temp_lows: formattedResponse.temperature_low,
    temp_highs: formattedResponse.temperature_high
  };

  return finalResponseObj;
};
