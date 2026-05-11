export async function getLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const text = await response.json();
    return JSON.stringify(text);
  } catch (err) {
    console.error(err);
  }
}

export async function getWeatherByCity({location}) {
  console.log("this is the city", location)
  // Geocoding—extract lat and lon
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
  );
  const geoData = await geoRes.json();
  console.log("this is geoData", geoData)

  const { latitude, longitude, name } = geoData.results[0];

  // Weather (Fahrenheit)—fetch weather (in fahrenheit)
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`,
  );
  const weatherData = await weatherRes.json();

  return weatherData.current_weather.temperature

}

export const tools = [
  {
    type: "function",
    function: {
      name: "getWeatherByCity",
      description: "Get the current weather for user's location and return the temperature in fareinheit",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City e.g. Los Angeles",
          },
        },
        required: ["location"],
        additionalProperties: false,
      },
    },
  },
];
