const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { marked } from "marked";
import DOMPurify from "dompurify";

export const postRequest = async (data, distance) => {
  try {
    const response = await fetch(VITE_BASE_URL + "/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: data, distance: distance }), // include distance in the request body
    });

    if (!response.ok) {
      // The server responded with an error status
      const errorResult = await response.json();
      console.error("Server error:", errorResult);
      throw new Error(errorResult.error || "Unknown server error");
    }

    const result = await response.json();
    console.log(result);
    // sanitize the response (which is a stringified JSON) to prevent XSS attacks, then parse it into a JavaScript object and return it
    const sanitizedResults = DOMPurify.sanitize(result.activitySuggestions);
    console.log(sanitizedResults);

    // parse the sanitized string into a JavaScript object
    const parsedResults = JSON.parse(sanitizedResults);
    console.log(parsedResults);
    return parsedResults;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};
