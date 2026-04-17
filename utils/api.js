const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const postRequest = async (data) => {
    console.log(data)
  try {
    const response = await fetch(VITE_BASE_URL + "/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message:data}),
    });
    const result = await response.json();
    console.log(result)
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};
