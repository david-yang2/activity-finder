import "dotenv/config";
import express from "express";
import cors from "cors";
import { submitAIrequest } from "./utils/AIModel.js";

const PORT = 8000;
const app = express();

// console.log(process.env.TEST);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json("this is another test of response!");
});

app.post("/test", (req, res) => {
// get user input from req.body and send it to the AI model, then return the response from the AI model to the frontend
  submitAIrequest(req.body.message);
  res.json("this is a test of response! Your message was: " + JSON.stringify(req.body.message));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
