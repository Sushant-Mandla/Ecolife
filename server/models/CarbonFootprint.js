const mongoose = require("mongoose");

const carbonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: Object,

    totalFootprint: Number, // kg CO2 per month

    categoryBreakdown: {
      transport: Number,
      energy: Number,
      food: Number,
      lifestyle: Number,
      waste: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarbonFootprint", carbonSchema);