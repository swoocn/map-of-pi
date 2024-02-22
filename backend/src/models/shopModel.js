const mongoose = require("mongoose");
const Product = require("./productModel");
const User = require("./userModel");

const shopSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  coordinates: [String, String],
  phone: String,
  email: String,
  description: String,
  image: String,
  owner: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

shopSchema.pre("remove", async function (next) {
  try {
    await Product.deleteMany({ shop: this._id });
    next();
  } catch (error) {
    console.log("product failed to be deleted while shop does");
    next(error);
  }
});

module.exports = mongoose.model("Shop", shopSchema);
