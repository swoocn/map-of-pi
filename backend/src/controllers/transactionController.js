const Order = require("../models/orderModel");

const getUserTransactions = async (req, res) => {

    const currentUser = req.currentUser;

  try {
  
    const transactions = await Order.find({ user: currentUser.uid })
      .sort({ createdAt: 1 })

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error getting user transactions", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

module.exports = { getUserTransactions };
