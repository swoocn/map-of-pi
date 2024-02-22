const mongoose = require("mongoose");
const Shop = require("./shopModel");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String,
  user: String,
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
