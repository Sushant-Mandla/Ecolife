const mongoose = require("mongoose");

const gardeningRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inputs: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    crops: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GardeningRecommendation", gardeningRecommendationSchema);
