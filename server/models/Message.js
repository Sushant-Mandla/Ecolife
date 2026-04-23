const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    text: String,
    fileUrl: String,
    fileName: String,
    audioUrl: String,
    reactions: [
      {
        userId: String,
        emoji: String,
      },
    ],
    deletedFor: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);