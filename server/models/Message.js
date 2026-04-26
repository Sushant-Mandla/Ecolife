const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    text: String,
    fileUrl: String,
    fileName: String,
    audioUrl: String,
    replyTo: {
      messageId: String,
      userId: String,
      userName: String,
      text: String,
    },
    isForwarded: {
      type: Boolean,
      default: false,
    },
    forwardedFrom: {
      messageId: String,
      userName: String,
    },
    reactions: [
      {
        userId: String,
        emoji: String,
      },
    ],
    pinnedBy: [String],
    starredBy: [String],
    deletedFor: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);