// controllers/binanceController.js

const User = require("../models/User");
const { encrypt } = require("../utils/encrypt");

/**
 * Connects user's Binance account by saving encrypted API keys.
 */
exports.connectBinance = async (req, res) => {
  const { userId, apiKey, apiSecret } = req.body;

  if (!userId || !apiKey || !apiSecret) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Encrypt the API keys before saving
    const encryptedKey = encrypt(apiKey);
    const encryptedSecret = encrypt(apiSecret);

    // Store or update the user in the DB
    const user = await User.findOneAndUpdate(
      { userId },
      {
        binanceApiKey: encryptedKey,
        binanceApiSecret: encryptedSecret,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Binance keys saved successfully.",
      user: {
        userId: user.userId,
        hasBinance: true,
      },
    });
  } catch (err) {
    console.error("Error saving Binance keys:", err);
    return res.status(500).json({ error: "Failed to save Binance keys" });
  }
};
