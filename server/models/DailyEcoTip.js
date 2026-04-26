const mongoose = require("mongoose");

const dailyEcoTipSchema = new mongoose.Schema({
  tipDate: {
    type: Date,
    required: true,
    unique: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DailyEcoTip", dailyEcoTipSchema);