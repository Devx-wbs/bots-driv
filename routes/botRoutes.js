const express = require("express");
const router = express.Router();
const { createBot } = require("../controllers/botController");

router.post("/create-bot", createBot);

module.exports = router;
