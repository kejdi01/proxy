require("dotenv").config(); // Load environment variables at the top

const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const NGROK_URL = process.env.NGROK_URL;

if (!NGROK_URL) {
  console.error("❌ NGROK_URL is not defined in your environment variables.");
  process.exit(1);
}

app.use(express.json()); // Correctly use JSON middleware

// GET webhook route
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
    console.error("❌ Error forwarding GET request:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    res.status(500).send("Internal Server Error");
  }
});

// POST webhook route
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
    console.error("❌ Error forwarding POST request:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    res.status(500).send("Internal Server Error");
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ ok: "ok" });
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server only if run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}

module.exports = app;
