import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {

    // Check API key
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ reply: "API key missing" });
    }

    let bodyData = req.body;

    // 🔥 Important: Sketchware sends wrapped JSON
    if (bodyData.json) {
      bodyData = JSON.parse(bodyData.json);
    }

    const messages = bodyData.messages;

    if (!messages) {
      return res.status(400).json({ reply: "Messages missing" });
    }

    // OpenRouter request
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:free",
          messages: messages
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        reply: data.error?.message || "Model error"
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
