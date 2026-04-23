const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const EcoBotConversation = require("../models/EcoBotConversation");

const router = express.Router();

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

const openRouterHeaders = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
};

if (process.env.OPENROUTER_SITE_URL) {
  openRouterHeaders["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
}

if (process.env.OPENROUTER_APP_NAME) {
  openRouterHeaders["X-Title"] = process.env.OPENROUTER_APP_NAME;
}

// TEXT GENERATION
router.post("/chat", async (req, res) => {
  try {
    const { message, attachmentSummary, attachmentText, attachmentName } = req.body;
    const userId = req.header("x-user-id") || "";

    const userMessage = [
      message,
      attachmentSummary,
      attachmentText ? `Attachment text from ${attachmentName || "file"}: ${attachmentText}` : "",
    ].filter(Boolean).join("\n\n");

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are EcoBot, an AI assistant for sustainable living and general knowledge." },
          { role: "user", content: userMessage }
        ],
      },
      {
        headers: openRouterHeaders,
      }
    );

    const reply = response.data.choices[0].message.content;

    // Persist only when user identity is available.
    if (userId && message?.trim()) {
      await EcoBotConversation.create({
        userId,
        userMessage: message.trim(),
        botReply: reply,
        attachment: {
          name: attachmentName || "",
          type: req.body.attachmentType || "",
          summary: attachmentSummary || "",
        },
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await EcoBotConversation.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch EcoBot history" });
  }
});

// IMAGE GENERATION (LIMIT CONTROL)
router.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const image = await axios.post(
      `${OPENROUTER_BASE_URL}/images/generations`,
      {
        model: "openai/gpt-image-1",
        prompt,
        size: "512x512"
      },
      {
        headers: openRouterHeaders,
      }
    );

    res.json({
      imageUrl: image.data.data[0].url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

module.exports = router;