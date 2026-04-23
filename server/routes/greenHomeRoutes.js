const express = require("express");
const router = express.Router();
const { saveScore } = require("../controllers/greenHomeController");

router.post("/score", saveScore);

module.exports = router;