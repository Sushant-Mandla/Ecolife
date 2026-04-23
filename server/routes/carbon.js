const express = require("express");
const router = express.Router();
const Carbon = require("../models/CarbonFootprint");
const authMiddleware = require("../middleware/authMiddleware");

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
router.post("/", authMiddleware, async (req, res) => {
  const calculation = calculateEmissions(req.body);

  const record = await Carbon.create({
    userId: req.userId,
    answers: req.body,
    totalFootprint: calculation.total,
    categoryBreakdown: calculation.breakdown,
  });

  res.json(record);
});

module.exports = router;