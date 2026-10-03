const mongoose = require("mongoose");

const gardeningInputSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  climate: String,
  temperature: String,
  temperatureRange: String,
  soil: String,
  budget: String,
  budgetLevel: String,
  waterAvailability: String,
  spaceType: String,
  sunlightHours: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GardeningInput", gardeningInputSchema);