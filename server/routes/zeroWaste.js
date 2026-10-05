const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getZeroWasteData, toggleDate } = require("../controllers/zeroWasteController");

const router = express.Router();

/* GET DATA */
router.get("/", authMiddleware, getZeroWasteData);

/* TOGGLE DATE */
router.put("/calendar", authMiddleware, toggleDate);

module.exports = router;
