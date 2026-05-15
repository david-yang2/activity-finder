export async function getLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const text = await response.json();
    return JSON.stringify(text);
  } catch (err) {
    console.error(err);
  }
}

function getDates( timeframe ) {
  // use date object to extract index for today (e.g. Monday is index 1)
  const today = new Date();
  if (timeframe.includes("today")) {
    return {
      start_date: today.toLocaleDateString('en-CA'),
      end_date: today.toLocaleDateString('en-CA'),
    };
  } else if (timeframe.includes("tomorrow")) {
    const tomorrow = new Date(today.setDate(today.getDate() + 1));

    return {
      start_date: tomorrow.toLocaleDateString('en-CA'),
      end_date: tomorrow.toLocaleDateString('en-CA'),
    };
  } else if (timeframe.includes("weekend")) {
    const daysToSaturday = 6 - today.getDay();

    const saturday = new Date(today.setDate(today.getDate() + daysToSaturday));
    // today has been set to sat, so we just need to +1 to get sun
    const sunday = new Date(today.setDate(today.getDate() + 1));

    return {
      start_date: saturday.toLocaleDateString('en-CA'),
      end_date: sunday.toLocaleDateString('en-CA'),
    };
  }
  const todaysDate = today.toLocaleDateString('en-CA');
  return { start_date: todaysDate, end_date: todaysDate };
}

export async function getWeatherByCity({ location, timeframe }) {

  const {start_date, end_date} = getDates(timeframe)
  // Geocoding—extract lat and lon
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
  );
  const geoData = await geoRes.json();

  const { latitude, longitude, name } = geoData.results[0];

  console.log("this is startDate", start_date);

  // Weather (Fahrenheit)—fetch weather (in fahrenheit)
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&start_date=${start_date}&end_date=${end_date}`,
  );
  const weatherData = await weatherRes.json();
  // console.log("this is the weatherdata", weatherData);
  // console.log(weatherData.current_weather.temperature)
  const time = weatherData.daily.time
  const temperature_2m_min = weatherData.daily.temperature_2m_min
  const temperature_2m_max = weatherData.daily.temperature_2m_max
  return { time, temperature_2m_min, temperature_2m_max };
}

export const tools = [
  {
    type: "function",
    function: {
      name: "getWeatherByCity",
      description:
        "Get the current weather for user's location and return the temperature in fareinheit",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City e.g. Los Angeles",
          },
          timeframe: {
            type: "string",
            description: "get the timeframe from user query e.g. today, tomorrow, weekend",
          },

        },
        required: ["location", "timeframe"],
        additionalProperties: false,
      },
    },
  },
];
