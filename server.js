require("dotenv").config(); // <-- Add this line at the very top
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const NGROK_URL = process.env.NGROK_URL;

// FIX: Add parentheses to express.json()
app.use(express.json());

app.get("/webhook", async (req, res) => {
  try {
    const response = await axios.get(`${NGROK_URL}/api/integrations/webhook/`, {
      params: req.query,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    res.set("Content-Type", "text/plain");

    res.status(response.status).send(response.data);
  } catch (error) {
    console.log("res", error.response.data);

    console.error("Error forwarding GET request:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const response = await axios.post(
      `${NGROK_URL}/api/integrations/webhook/`,
      req.body,
      {
        params: req.query,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    res.set("Content-Type", "text/plain");
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding POST request:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/health", (req, res) => {
  // FIX: no 'response' object here
  res.json({ ok: "ok" });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
