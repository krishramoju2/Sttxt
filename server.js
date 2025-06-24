require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static("public"));

app.get("/get-deepgram-url", (req, res) => {
  const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
  const deepgramURL = `wss://api.deepgram.com/v1/listen?punctuate=true`;
  const signedUrl = `${deepgramURL}&access_token=${DEEPGRAM_API_KEY}`;
  res.json({ url: signedUrl });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
