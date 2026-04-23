const express = require("express");
const router = express.Router();
const { generateCrops } = require("../controllers/gardeningController");

router.post("/generate", generateCrops);

module.exports = router;