const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const sendEmail = require("../utils/sendEmail");
const { getOrCreateDailyTip } = require("../utils/dailyEcoTip");

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

    await sendEmail(
      email,
      "🌿 Welcome to Daily Eco Tips",
      "Thanks for subscribing! Your subscription is active. You will receive daily sustainability tips in your inbox."
    );

    try {
      const dailyTip = await getOrCreateDailyTip();
      const tip = dailyTip.content;

      await sendEmail(
      email,
      "🌿 Your First Eco Tip",
      `Thanks for subscribing! Here is your first eco tip:\n\n${tip}`
      );
    } catch (emailError) {
      console.error("Optional first eco tip email failed:", emailError.message);
    }

    res.json({ message: "Subscribed successfully! Check your inbox for a welcome email." });
  } catch (error) {
    console.error("Subscription email error:", error.message);
    res.status(500).json({ error: "Subscription failed" });
  }
});

module.exports = router;