const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { chat, history, image } = require("../controllers/aiController");

const router = express.Router();

// TEXT GENERATION
router.post("/chat", authMiddleware, chat);

router.get("/history", authMiddleware, history);

// IMAGE GENERATION (LIMIT CONTROL)
router.post("/image", image);

module.exports = router;
