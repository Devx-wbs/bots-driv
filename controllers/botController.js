const axios = require("axios");
const crypto = require("crypto");

const THREE_COMMAS_API_KEY = process.env.THREE_COMMAS_API_KEY;
const THREE_COMMAS_API_SECRET = process.env.THREE_COMMAS_API_SECRET;

// Replace this with your connected account_id from your 3Commas account
const THREE_COMMAS_ACCOUNT_ID = process.env.THREE_COMMAS_ACCOUNT_ID;

function getSignature(queryString) {
  return crypto
    .createHmac("sha256", THREE_COMMAS_API_SECRET)
    .update(queryString)
    .digest("hex");
}

exports.createBot = async (req, res) => {
  const {
    botType = "dca", // default to dca
    name,
    pair,
    base_order_volume,
    take_profit_percentage,
    safety_order_volume,
    safety_order_step_percentage,
    martingale_volume_coefficient,
    martingale_step_coefficient,
    max_safety_orders,
    active_safety_orders_count,
    cooldown,
    lower_price,
    upper_price,
    quantity_per_grid,
    grids_quantity,
    // add more grid params as needed
  } = req.body;

  let payload, endpoint;

  if (botType === "grid") {
    // GRID bot payload and endpoint
    endpoint = "https://api.3commas.io/public/api/ver1/grid_bots/manual";
    payload = {
      name,
      account_id: THREE_COMMAS_ACCOUNT_ID,
      pair,
      lower_price,
      upper_price,
      quantity_per_grid,
      grids_quantity,
      // do NOT include strategy_list here
    };
  } else {
    // DCA bot payload and endpoint
    endpoint = "https://api.3commas.io/public/api/ver1/bots/create_bot";
    payload = {
      name,
      account_id: THREE_COMMAS_ACCOUNT_ID,
      pairs: [pair],
      base_order_volume,
      take_profit: take_profit_percentage,
      take_profit_type: "total",
      safety_order_volume,
      safety_order_step_percentage,
      martingale_volume_coefficient,
      martingale_step_coefficient,
      max_safety_orders,
      active_safety_orders_count,
      cooldown,
      strategy: "long",
      leverage_type: "not_specified",
      strategy_list: [{ options: {}, strategy: "nonstop" }], // correct format
    };
  }

  const queryString = `request=${JSON.stringify(payload)}`;
  const signature = getSignature(queryString);

  // Debug logging
  console.log("--- 3Commas Bot Creation Debug ---");
  console.log("Endpoint:", endpoint);
  console.log("Payload:", JSON.stringify(payload));
  console.log("QueryString:", queryString);
  console.log("Signature:", signature);
  console.log("Headers:", {
    APIKEY: THREE_COMMAS_API_KEY,
    Signature: signature,
  });

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        APIKEY: THREE_COMMAS_API_KEY,
        Signature: signature,
      },
    });

    res.status(200).json({
      message: "Bot created successfully",
      bot: response.data,
    });
  } catch (err) {
    console.error("Bot creation error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to create bot",
      details: err.response?.data || err.message,
    });
  }
};
