const mongoose = require("mongoose");

const ecoBotConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userMessage: {
      type: String,
      required: true,
      trim: true,
    },
    botReply: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      name: { type: String, default: "" },
      type: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EcoBotConversation", ecoBotConversationSchema);
