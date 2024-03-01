const Product = require("../models/productModel");
const Shop = require("../models/shopModel");

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("products");
    return shops.length > 0
      ? res.status(200).json({ shops })
      : res.status(404).json({ message: "No businesses found" });
  } catch (error) {
    console.error("Error while searching all shops:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const registerShop = async (req, res) => {
  const currentUser = req.currentUser;
  try {
    const newShop = await Shop.create({ ...req.body, owner: currentUser.uid });
    await currentUser.shops.push(newShop);
    return res.status(200).json({ newShop });
  } catch (error) {
    console.error("Error while registering new business:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSingleShop = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shop = await Shop.findById(shopId);
    return shop
      ? res.status(200).json({ shop })
      : res.status(404).json({ message: "No business found" });
  } catch (error) {
    console.error("Error while searching single shop:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteShop = async (req, res) => {
  const { shopId } = req.params;
  const currentUser = req.currentUser;
  try {
    const shopToDelete = await Shop.findById(shopId);
    if (shopToDelete && shopToDelete.owner === currentUser.uid) {
      await Shop.findByIdAndDelete(shopId);
      console.log("Successfully deleted business:", shopToDelete);
      return res.status(200).json({ message: "Business deleted successfully" });
    } else {
      console.error("Business removal denied due to lack of permission");
      return res.status(401).json({ message: "Business removal denied due to lack of permission" });
    }
  } catch (error) {
    console.error("Error while deleting shop:", error.message);
    return res.status(500).json({ error: "Internal server error while deleting shop" });
  }
};

const updateShop = async (req, res) => {
  const { shopId } = req.params;
  const currentUser = req.currentUser;
  try {
    const shopToUpdate = await Shop.findById(shopId);
    if (shopToUpdate && shopToUpdate.owner === currentUser.uid) {
      await Shop.updateOne({ _id: shopId }, { ...req.body }, { new: true });
      console.log("Successfully updated business: ", shopToUpdate);
      return res.status(200).json({ message: "Business updated successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized to update this business" });
    }
  } catch (error) {
    console.error("Error while updating shop:", error.message);
    return res.status(500).json({ error: "Internal server error while updating shop" });
  }
};


const getShopProducts = async (req, res) => {
  const { shopId } = req.params;
  try {
    const products = await Product.find({ shop: shopId });
    return products.length > 0
      ? res.status(200).json({ products })
      : res.status(200).json({ message: "Business has no products" });
  } catch (error) {
    console.error("Error while searching products for a shop:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerShop,
  getAllShops,
  deleteShop,
  updateShop,
  getShopProducts,
  getSingleShop
};
