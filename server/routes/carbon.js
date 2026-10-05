const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { submitCalculation } = require("../controllers/carbonController");

const router = express.Router();

/* Submit calculator */
router.post("/", authMiddleware, submitCalculation);

module.exports = router;
