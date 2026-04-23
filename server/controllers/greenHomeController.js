const GreenHomeScore = require("../models/GreenHomeScore");

exports.saveScore = async (req, res) => {
  try {
    const { score, level } = req.body;
    const userId = req.header("x-user-id");

    const newScore = new GreenHomeScore({
      userId,
      score,
      level,
    });

    await newScore.save();

    res.status(201).json({ message: "Score saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};