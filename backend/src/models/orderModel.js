const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  pi_payment_id: String,
  product_id: String,
  user: String,
  txid: String,
  paid: Boolean,
  cancelled: Boolean,
  created_at: Date,
  amount:Number,
});

module.exports = mongoose.model("Order", orderSchema);
