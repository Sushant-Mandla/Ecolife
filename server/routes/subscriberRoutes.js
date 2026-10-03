const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const EcoTipDelivery = require("../models/EcoTipDelivery");
const sendEmail = require("../utils/sendEmail");
const { getOrCreateDailyTip } = require("../utils/dailyEcoTip");

router.post("/subscribe", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    try {
      await Subscriber.create({ email });
    } catch (error) {
      if (error?.code === 11000) {
      return res.status(400).json({ message: "Already subscribed" });
      }
      throw error;
    }

    try {
      await sendEmail(
      email,
      "🌿 Welcome to Daily Eco Tips",
      "Thanks for subscribing! Your subscription is active. You will receive daily sustainability tips in your inbox."
      );
    } catch (emailError) {
      console.error("Welcome email failed after subscription was saved:", emailError.message);
    }

    try {
      const dailyTip = await getOrCreateDailyTip();
      await sendEmail(
      email,
      "🌿 Your First Eco Tip",
      `Thanks for subscribing! Here is your first eco tip:\n\n${dailyTip.content}`
      );
      await EcoTipDelivery.create({
        subscriberId: (await Subscriber.findOne({ email }))._id,
        email,
        tipDate: dailyTip.tipDate,
        tipContent: dailyTip.content,
      });
    } catch (emailError) {
      console.error("Optional first eco tip email failed:", emailError.message);
    }

    return res.status(201).json({
      message: "Subscribed successfully! Daily eco tips are enabled for this email.",
    });
  } catch (error) {
    console.error("Subscription error:", error.message);
    return res.status(500).json({ message: "Unable to save your subscription right now." });
  }
});

module.exports = router;