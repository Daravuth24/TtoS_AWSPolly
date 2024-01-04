const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AWS = require("aws-sdk");

require("dotenv").config();

const app = express();
const port = 3001; // or any preferred port

app.use(cors());
app.use(bodyParser.json());

AWS.config.update({
  region: process.env.AWS_REGION,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
});

// Implement Polly text-to-speech endpoint here
const Polly = new AWS.Polly();

app.post("/synthesize", async (req, res) => {
  const { text, voiceId } = req.body;

  try {
    const params = {
      OutputFormat: "mp3",
      Text: text,
      VoiceId: voiceId || "Joanna", // Set default voice or provide voiceId in request
    };

    const data = await Polly.synthesizeSpeech(params).promise();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(data.AudioStream);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
