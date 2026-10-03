const express = require("express");
const router = express.Router();
const ZeroWaste = require("../models/ZeroWaste");
const authMiddleware = require("../middleware/authMiddleware");

/* Utility: Calculate the current run ending today and the longest run ever. */
const calculateStreak = (dates) => {
  const uniqueDates = [...new Set(dates)].sort();
  if (!uniqueDates.length) return { current: 0, longest: 0 };

  const completedDateSet = new Set(uniqueDates);
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  let currentDate = new Date(`${today}T00:00:00.000Z`);

  while (completedDateSet.has(currentDate.toISOString().slice(0, 10))) {
    current++;
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  }

  let longest = 1;
  let run = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previous = new Date(`${uniqueDates[i - 1]}T00:00:00.000Z`);
    const currentDate = new Date(`${uniqueDates[i]}T00:00:00.000Z`);
    const diff = (currentDate - previous) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
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

  const streakData = calculateStreak(data.completedDates);
  data.currentStreak = streakData.current;
  data.longestStreak = streakData.longest;
  await data.save();

  res.json(data);
});

/* TOGGLE DATE */
router.put("/calendar", authMiddleware, async (req, res) => {
  const { date } = req.body;

  if (date > new Date().toISOString().slice(0, 10)) {
    return res.status(400).json({ message: "Future dates cannot be completed." });
  }

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