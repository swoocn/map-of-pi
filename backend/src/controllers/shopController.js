const Product = require("../models/productModel");
const Shop = require("../models/shopModel");

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("products");
    if (shops.length > 0) {
      return res.status(200).json({ shops });
    } else res.status(404).json({ message: "No shops found" });
  } catch (error) {
    console.log(
      "internal server error while searching all shops: " + error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

const registerShop = async (req, res) => {
  const currentUser = req.currentUser;

  try {
    const newShop = await Shop.create({ ...req.body, owner: currentUser.uid });
    
    await currentUser.shops.push(newShop);

    return res.status(200).json({newShop});
  } catch (error) {
    console.log(
      "internal server error while registering new shop: " + error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSingleShop = async (req, res) => {
  const shopId = req.params.shopId;
  try {
    const shop = await Shop.findById(shopId);
    if (shop) {
      return res.status(200).json({ shop });
    } else
      res.status(404).json({ message: "Shop u are looking for doesnt exists" });
  } catch (error) {
    console.log(
      "internal server error while searching single shop: " + error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteShop = async (req, res) => {
  const shopId = req.params.shopId;

  const currentUser = req.currentUser;

  try {
    const shopToDelete = await Shop.findById(shopId);

    if (shopToDelete && shopToDelete.owner === currentUser.uid) {
      await Shop.findByIdAndDelete(shopId);
      console.log("successfully deleted shop : ", shopToDelete);
      return res.status(200).json({ message: "shop deleted successfully" });
    } else {
      console.log(
        "u can't delete this shop since u are not the owner nor admin of map of pi"
      );

      return res.status(401).json({
        message:
          "You can't delete this shop, Since you are not the owner of this shop nor admin of map of pi",
      });
    }
  } catch (error) {
    console.log("internal server error while deleting shop : " + error.message);
  }
};

const updateShop = async (req, res) => {
  const { shopId } = req.params;
  const currentUser = req.currentUser;

  try {
    const shopToUpdate = await Shop.findById(shopId);

    if (shopToUpdate && shopToUpdate.owner === currentUser.uid) {
      await Shop.updateOne({ _id: shopId }, { ...req.body }, { new: true });

      console.log("successfully updated shop : ", shopToUpdate);

      return res.status(200).json({ message: "shop updated successfully" });
    }
  } catch (error) {
    console.log("error while updating shop : " + error.message);
    res
      .status(500)
      .json({ error: "Internal server error while updating shop" });
  }
};


const getShopProducts = async (req, res) => {
  const {shopId} = req.params;

  try {
    const products = await Product.find({ shop: shopId });

    if (products.length > 0) {
      return res.status(200).json({ products });
    } else {
      return res.status(200).json({ message: "Shop doesn't have any products" });
    }
  } catch (error) {
    console.log(
      "Internal server error while searching products for a shop: " + error.message
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  registerShop,
  getAllShops,
  deleteShop,
  updateShop,
  getShopProducts
};
