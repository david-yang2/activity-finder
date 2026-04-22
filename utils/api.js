const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { marked } from "marked"
import DOMPurify from "dompurify"

export const postRequest = async (data) => {
  try {
    const response = await fetch(VITE_BASE_URL + "/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message:data}),
    });
    const result = await response.json();
    
    // sanitize the response (which is a stringified JSON) to prevent XSS attacks, then parse it into a JavaScript object and return it
    const sanitizedResults = DOMPurify.sanitize(result.activitySuggestions);

    // parse the sanitized string into a JavaScript object
    const parsedResults = JSON.parse(sanitizedResults);
    return parsedResults;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};
