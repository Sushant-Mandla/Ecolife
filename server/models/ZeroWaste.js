const mongoose = require("mongoose");

const zeroWasteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    completedDates: {
      type: [String], // YYYY-MM-DD
      default: [],
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ZeroWaste", zeroWasteSchema);