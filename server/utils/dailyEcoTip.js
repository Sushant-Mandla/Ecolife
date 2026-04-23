const cron = require("node-cron");
const axios = require("axios");
const Subscriber = require("../models/Subscriber");
const sendEmail = require("./sendEmail");

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

const generateTip = async () => {
  const prompt = "Generate one short practical sustainability tip for daily life.";

  const response = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: openRouterHeaders,
    }
  );

  return response.data.choices[0].message.content;
};

const getStartOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const sendDailyTipsIfNeeded = async () => {
  console.log("Checking daily eco tip queue...");

  try {
    const startOfToday = getStartOfToday();
    const pendingSubscribers = await Subscriber.find({
      $or: [
        { lastTipSentAt: { $exists: false } },
        { lastTipSentAt: null },
        { lastTipSentAt: { $lt: startOfToday } },
      ],
    });

    if (pendingSubscribers.length === 0) {
      console.log("No pending subscribers for today's eco tip.");
      return;
    }

    let tip;
    try {
      tip = await generateTip();
    } catch (tipError) {
      console.error("Tip generation failed, using fallback tip:", tipError.message);
      tip = "Turn off standby devices at night to cut hidden electricity usage.";
    }

    for (const sub of pendingSubscribers) {
      try {
        await sendEmail(sub.email, "🌿 Your Daily Eco Tip", tip);

        await Subscriber.updateOne(
          { _id: sub._id },
          { $set: { lastTipSentAt: new Date() } }
        );
      } catch (emailError) {
        console.error(`Failed to send daily eco tip to ${sub.email}:`, emailError.message);
      }
    }
  } catch (error) {
    console.error("Daily eco tip generation failed:", error.message);
  }
};

// Run once on startup so subscribers don't miss tips after server restarts.
setTimeout(() => {
  sendDailyTipsIfNeeded();
}, 15000);

// Re-check every hour and send only to users who haven't received today's tip.
cron.schedule("0 * * * *", async () => {
  await sendDailyTipsIfNeeded();
});

module.exports = { generateTip, sendDailyTipsIfNeeded };