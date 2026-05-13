import { getWeatherModel } from "./getWeatherModel.js";
import { webSearchModel } from "./webSearchModel.js";
export const submitAIrequest = async (payload) => {

  const queryWithWeather = await getWeatherModel(payload.message)

  const finalResponse = await webSearchModel(queryWithWeather, payload.distance)

  return finalResponse
};
