const RAW_BASE_URL = (import.meta.env.VITE_BASE_URL || "").trim();

import DOMPurify from "dompurify";


const getApiURL = () => {
  if (typeof window !== "undefined") {
    const isProdHost = window.location.hostname !== "localhost";
    const isLocalBase = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
      RAW_BASE_URL,
    );
    if (isProdHost && isLocalBase) {
      return "/api/openai";
    }
  }
  return `${RAW_BASE_URL}/api/openai`;
};


export const postRequest = async (data, distance) => {
  try {
    const response = await fetch(getApiURL(), {
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
