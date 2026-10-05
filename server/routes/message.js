const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMessages,
  deleteMessage,
  uploadMedia,
  getMedia,
} = require("../controllers/messageController");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.get("/", authMiddleware, getMessages);

router.put("/delete/:id", authMiddleware, deleteMessage);

router.post("/upload", upload.single("file"), uploadMedia);

router.get("/media/:id", getMedia);

module.exports = router;
