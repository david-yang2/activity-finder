export async function getLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const text = await response.json();
    return JSON.stringify(text);
  } catch (err) {
    console.log(err);
  }
}

export function getWeather(location) {
  const temperatures = {
    Oakland: 65,
    "San Francisco": 60,
    Berkeley: 62,
    "San Jose": 68,
    "Palo Alto": 66,
  };
//   return temperatures[location] || "Weather condition not available"
return temperatures[location] || 65; // default to 65 if location not found (for testing purposes)
}
