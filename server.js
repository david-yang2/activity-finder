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

app.post("/test", async (req, res) => {
// get user input from req.body and send it to the AI model, then return the response from the AI model to the frontend
const activitySuggestions = await submitAIrequest(req.body.message);
res.json({activitySuggestions});
console.log("response sent")
  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
