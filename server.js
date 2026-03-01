import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/chat", async (req, res) => {

    try {

        const messages = req.body.messages;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.sk-or-v1-403...069}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3-8b-instruct:free",
                    messages: messages
                })
            }
        );

        const data = await response.json();

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({
            reply: "Server error"
        });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
