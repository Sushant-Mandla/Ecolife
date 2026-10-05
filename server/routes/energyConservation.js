const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getEnergyState, saveEnergyState } = require("../controllers/energyConservationController");

const router = express.Router();

router.get("/", authMiddleware, getEnergyState);

router.put("/", authMiddleware, saveEnergyState);

module.exports = router;
