const mongoose = require("mongoose");

const applianceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    watts: { type: Number, required: true },
    isOn: { type: Boolean, default: false },
    hours: { type: Number, default: 0 },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    appliances: { type: [applianceSchema], default: [] },
  },
  { _id: false }
);

const energyConservationStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    rooms: {
      type: Map,
      of: roomSchema,
      default: {},
    },
    activeTab: {
      type: String,
      default: "Living Room",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnergyConservationState", energyConservationStateSchema);
