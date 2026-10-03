const mongoose = require("mongoose");

const ecoTipDeliverySchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    tipDate: {
      type: Date,
      required: true,
      index: true,
    },
    tipContent: {
      type: String,
      required: true,
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ecoTipDeliverySchema.index({ subscriberId: 1, tipDate: 1 }, { unique: true });

module.exports = mongoose.model("EcoTipDelivery", ecoTipDeliverySchema);
