const express = require("express");
const Bookmark = require("../models/GuideBookmark");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/:guideId", auth, async (req, res) => {
  const bookmark = await Bookmark.create({
    userId: req.userId,
    guideId: req.params.guideId
  });
  res.json(bookmark);
});

module.exports = router;