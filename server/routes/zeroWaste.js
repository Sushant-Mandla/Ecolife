const express = require("express");
const router = express.Router();
const ZeroWaste = require("../models/ZeroWaste");
const authMiddleware = require("../middleware/authMiddleware");

/* Utility: Calculate Streak */
const calculateStreak = (dates) => {
  if (!dates.length) return { current: 0, longest: 0 };

  const sorted = dates.sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return { current, longest };
};

/* GET DATA */
router.get("/", authMiddleware, async (req, res) => {
  let data = await ZeroWaste.findOne({ userId: req.userId });

  if (!data) {
    data = await ZeroWaste.create({ userId: req.userId });
  }

  res.json(data);
});

/* TOGGLE DATE */
router.put("/calendar", authMiddleware, async (req, res) => {
  const { date } = req.body;

  let data = await ZeroWaste.findOne({ userId: req.userId });

  if (!data) {
    data = await ZeroWaste.create({ userId: req.userId });
  }

  if (data.completedDates.includes(date)) {
    data.completedDates = data.completedDates.filter(d => d !== date);
  } else {
    data.completedDates.push(date);
  }

  const streakData = calculateStreak(data.completedDates);
  data.currentStreak = streakData.current;
  data.longestStreak = streakData.longest;

  await data.save();

  res.json(data);
});

module.exports = router;