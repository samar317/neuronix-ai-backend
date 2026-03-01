import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ reply: "API key missing" });
    }

    const messages = req.body.messages;

    if (!messages) {
      return res.status(400).json({ reply: "Messages missing" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: messages
      })
    });

    const data = await response.json();

    console.log("OpenRouter response:", data);

    if (!data.choices) {
      return res.status(500).json({ reply: "Model error" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running"));
