const cron = require("node-cron");
const axios = require("axios");
const Subscriber = require("../models/Subscriber");
const DailyEcoTip = require("../models/DailyEcoTip");
const sendEmail = require("./sendEmail");

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

const FALLBACK_TIPS = [
  "Switch one short car trip today to walking, cycling, or public transport.",
  "Run full laundry loads in cold water to save both energy and water.",
  "Carry a reusable bottle and refill it instead of buying single-use plastic bottles.",
  "Unplug chargers and standby devices overnight to cut hidden electricity use.",
  "Plan one plant-based meal today to reduce your food carbon footprint.",
  "Use natural daylight for at least one hour instead of turning on lights.",
  "Keep AC at 24-26C and use a fan to stay comfortable with lower energy use.",
];

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
  const today = new Date();
  const dayLabel = today.toISOString().slice(0, 10);

  const recentTips = await DailyEcoTip.find({})
    .sort({ tipDate: -1 })
    .limit(7)
    .select("content -_id")
    .lean();

  const recentTipLines = recentTips
    .map((tip, idx) => `${idx + 1}. ${tip.content}`)
    .join("\n");

  const prompt = [
    `Today is ${dayLabel}.`,
    "Generate exactly one short, practical sustainability tip for daily life.",
    "Constraints:",
    "- Keep it under 25 words.",
    "- Use plain text only (no emojis, no numbering, no quotes).",
    "- It must be clearly different from the recent tips below.",
    recentTipLines ? `Recent tips (do not repeat):\n${recentTipLines}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      model: "openai/gpt-4o-mini",
      temperature: 0.9,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: openRouterHeaders,
    }
  );

  return String(response.data?.choices?.[0]?.message?.content || "").trim();
};

const normalizeTip = (tip) =>
  String(tip || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const getStartOfDay = (inputDate = new Date()) => {
  const date = new Date(inputDate);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getOrCreateDailyTip = async (inputDate = new Date()) => {
  const dayStart = getStartOfDay(inputDate);
  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);

  const existing = await DailyEcoTip.findOne({
    tipDate: { $gte: dayStart, $lt: nextDay },
  }).lean();

  if (existing?.content) {
    return existing;
  }

  const recentTips = await DailyEcoTip.find({})
    .sort({ tipDate: -1 })
    .limit(10)
    .select("content -_id")
    .lean();
  const recentTipSet = new Set(recentTips.map((tip) => normalizeTip(tip.content)));

  let finalTip = "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const candidate = await generateTip();
      const normalizedCandidate = normalizeTip(candidate);
      if (normalizedCandidate && !recentTipSet.has(normalizedCandidate)) {
        finalTip = candidate;
        break;
      }
    } catch (error) {
      // Continue to fallback selection if generation fails repeatedly.
    }
  }

  if (!finalTip) {
    const dayIndex = Math.floor(dayStart.getTime() / 86400000) % FALLBACK_TIPS.length;
    finalTip = FALLBACK_TIPS[dayIndex];
  }

  try {
    const created = await DailyEcoTip.create({
      tipDate: dayStart,
      content: finalTip,
    });
    return created.toObject();
  } catch (error) {
    if (error?.code === 11000) {
      const raceWinner = await DailyEcoTip.findOne({
        tipDate: { $gte: dayStart, $lt: nextDay },
      }).lean();

      if (raceWinner?.content) {
        return raceWinner;
      }
    }

    throw error;
  }
};

const sendDailyTipsIfNeeded = async () => {
  console.log("Checking daily eco tip queue...");

  try {
    const startOfToday = getStartOfDay();
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

    let tip = "";
    try {
      const dailyTip = await getOrCreateDailyTip();
      tip = dailyTip.content;
    } catch (tipError) {
      console.error("Tip generation failed, using fallback tip:", tipError.message);
      const dayIndex = Math.floor(startOfToday.getTime() / 86400000) % FALLBACK_TIPS.length;
      tip = FALLBACK_TIPS[dayIndex];
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

module.exports = { generateTip, getOrCreateDailyTip, sendDailyTipsIfNeeded };