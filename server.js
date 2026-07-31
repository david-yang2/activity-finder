import "dotenv/config";
import express from "express";
import cors from "cors";
import { submitAIrequest } from "./backend_utils/AIModel.js";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import {rateLimit} from 'express-rate-limit'

const PORT = process.env.PORT || 8000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());
// Serve Vite build output on Render (and other Node hosts).
app.use(express.static(distPath));


// SPA fallback so routes like /, /about, etc. all return index.html.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


const limiter = rateLimit({
  windowMs: 1*60 *1000, 
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders:false,
  ipv6Subnet:56,
  handler: (req, res) => {
    res.status(429).json({error: "You are sending requests too quickly. Please wait and try again later"
    })
  }
})



app.use('/api',limiter)
app.post("/api/openai", async (req, res) => {

  try {

    // get user input from req.body and send it to the AI model, then return the response from the AI model to the frontend
    const activitySuggestions = await submitAIrequest(req.body);
    res.json(activitySuggestions);
  } catch (error){

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
