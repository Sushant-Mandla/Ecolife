const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { PassThrough } = require("stream");
const Message = require("../models/Message");
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const getMediaBucket = () => {
  if (!mongoose.connection?.db) {
    throw new Error("Database connection is not ready");
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "chatMedia",
  });
};

router.get("/", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

router.put("/delete/:id", async (req, res) => {
  const { userId } = req.body;

  await Message.findByIdAndUpdate(req.params.id, {
    $addToSet: { deletedFor: userId },
  });

  res.json({ success: true });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const bucket = getMediaBucket();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const storedFileName = `${uniqueSuffix}-${req.file.originalname}`;

    const uploadStream = bucket.openUploadStream(storedFileName, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
      },
    });

    await new Promise((resolve, reject) => {
      const stream = new PassThrough();
      stream.end(req.file.buffer);
      stream.pipe(uploadStream).on("finish", resolve).on("error", reject);
    });

    const mediaUrl = `${req.protocol}://${req.get("host")}/api/messages/media/${uploadStream.id}`;

    return res.json({
      fileUrl: mediaUrl,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({ error: "File upload failed" });
  }
});

router.get("/media/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid media id" });
  }

  try {
    const bucket = getMediaBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return res.status(404).json({ error: "Media not found" });
    }

    const file = files[0];
    const safeName = String(file.metadata?.originalName || file.filename || "file").replace(/"/g, "");
    const contentType = file.contentType || "application/octet-stream";
    const disposition = contentType.startsWith("image/") || contentType.startsWith("audio/")
      ? "inline"
      : "attachment";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `${disposition}; filename="${safeName}"`);

    return bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error("Media Read Error:", error.message);
    return res.status(500).json({ error: "Failed to load media" });
  }
});

module.exports = router;