const mongoose = require("mongoose");
const Shop = require("./shopModel");

const userSchema = new mongoose.Schema({
  username: String,
  uid: String,
  role: [String],
  accessToken: String,
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
});

module.exports = mongoose.model("User", userSchema);
