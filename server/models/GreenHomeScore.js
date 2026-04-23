const mongoose = require("mongoose");

const greenHomeScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  score: Number,
  level: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GreenHomeScore", greenHomeScoreSchema);