import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/chat", async (req, res) => {

    try {

        const messages = req.body.messages;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages
            })
        });

        const data = await response.json();

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({ reply: "Server error" });
    }
});

app.listen(3000);
