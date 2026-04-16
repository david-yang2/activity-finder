import 'dotenv/config';
import express from "express";
import cors from "cors";


const PORT = 8000
const app = express();

console.log(process.env.TEST);

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.get("/", (req, res) => {
    res.json("this is another test of response!")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})