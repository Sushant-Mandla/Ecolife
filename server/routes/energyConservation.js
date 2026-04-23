const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const EnergyConservationState = require("../models/EnergyConservationState");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const state = await EnergyConservationState.findOne({ userId: req.userId });

    if (!state) {
      return res.json({
        rooms: null,
        activeTab: "Living Room",
      });
    }

    return res.json({
      rooms: state.rooms,
      activeTab: state.activeTab,
      updatedAt: state.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch energy state" });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { rooms, activeTab } = req.body;

    const updated = await EnergyConservationState.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          rooms,
          activeTab,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      message: "Energy conservation state saved",
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save energy state" });
  }
});

module.exports = router;
