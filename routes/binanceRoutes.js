const express = require("express");
const router = express.Router();
const { connectBinance } = require("../controllers/binanceController");

router.post("/connect-binance", connectBinance);

module.exports = router;
