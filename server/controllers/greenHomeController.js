// const GreenHomeScore = require("../models/GreenHomeScore");

// exports.saveScore = async (req, res) => {
//   try {
//     const { score, level } = req.body;
//     const userId = req.header("x-user-id");

//     const newScore = new GreenHomeScore({
//       userId,
//       score,
//       level,
//     });

//     await newScore.save();

//     res.status(201).json({ message: "Score saved successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

const GreenHomeScore = require("../models/GreenHomeScore");

exports.saveScore = async (req, res) => {
  try {
    const { score, level } = req.body;

    const userId = req.userId;

    if (score === undefined || !level) {
      return res.status(400).json({
        error: "Score and level are required",
      });
    }

    const newScore = new GreenHomeScore({
      userId,
      score,
      level,
    });

    await newScore.save();

    res.status(201).json({
      message: "Score saved successfully",
    });
  } catch (error) {
    console.error("Error saving Green Home Score:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
};