const express = require("express");
const GuideProgress = require("../models/GuideProgress");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/:guideId", auth, async (req, res) => {
  const { completedChecklist, quizScore } = req.body;

  const completionPercent = Math.min(
    100,
    (completedChecklist.length * 10) + quizScore
  );

  const progress = await GuideProgress.findOneAndUpdate(
    { userId: req.userId, guideId: req.params.guideId },
    { completedChecklist, quizScore, completionPercent },
    { upsert: true, new: true }
  );

  res.json(progress);
});

module.exports = router;