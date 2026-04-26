const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Carbon = require("../models/CarbonFootprint");

/* Calculate emissions */
const calculateEmissions = (data) => {
  const transport =
    data.carKm * 0.21 +
    data.bikeKm * 0.09 +
    data.publicKm * 0.05 +
    data.shortFlights * 150 +
    data.longFlights * 300;

  const energy =
    data.electricityBill * 0.5 +
    data.acHours * 2 +
    data.lpgCylinders * 40;

  const food =
    data.meatMeals * 5 +
    data.dairyLevel * 2;

  const lifestyle =
    data.onlineOrders * 3 +
    data.fastFashion * 8 +
    data.plasticUse * 2;

  const waste =
    (data.recycles ? -10 : 20) +
    (data.composts ? -15 : 25);

  const total =
    transport + energy + food + lifestyle + waste;

  return {
    total,
    breakdown: {
      transport,
      energy,
      food,
      lifestyle,
      waste,
    },
  };
};

/* Submit calculator */
router.post("/", async (req, res) => {
  try {
    const calculation = calculateEmissions(req.body);
    const userId = req.headers["x-user-id"];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const record = await Carbon.create({
        userId,
        answers: req.body,
        totalFootprint: calculation.total,
        categoryBreakdown: calculation.breakdown,
      });

      return res.json(record);
    }

    return res.json({
      totalFootprint: calculation.total,
      categoryBreakdown: calculation.breakdown,
      saved: false,
    });
  } catch (error) {
    console.error("Carbon calculation error:", error.message);
    return res.status(500).json({ error: "Failed to calculate carbon footprint" });
  }
});

module.exports = router;