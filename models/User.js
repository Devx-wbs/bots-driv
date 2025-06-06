const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  binanceApiKey: String,
  binanceApiSecret: String,
  threeCommasAccountId: String, // Optional if needed for future use
});

module.exports = mongoose.model("User", userSchema);
