import "dotenv/config";
import express from "express";
import cors from "cors";
import { submitAIrequest } from "./utils/AIModel.js";
import helmet from "helmet";

const PORT = 8000;
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json("this is another test of response!");
});

app.post("/api/openai", async (req, res) => {

  try {

    // get user input from req.body and send it to the AI model, then return the response from the AI model to the frontend
    const activitySuggestions = await submitAIrequest(req.body);
    res.json({activitySuggestions});
  } catch (error){
    // console.log("server.js --", error.message);

    console.error("Error in /api/openai route:", error);
    const extractRemainingTime = error.message.match(/in (\d+m\d+)/);

    // if no time is extracted, default to "later"
    const time = extractRemainingTime ? extractRemainingTime[1] : "later";
    res.status(error.status).json({ error: `Unfortunately the token limit has been exceeded. Please try again in ${time}${time === "later" ? '':'s'}.` });

  }

  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
