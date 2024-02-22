const axios = require("axios");
const express = require("express");
const platformAPIClient = require("../services/platformAPIClient");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const isAuthenticated = require("../authMiddleware/isAuthenticated");
const util = require("util");
const fs = require("fs");

const router = express.Router();

// handle the incomplete payment
router.post("/incomplete",isAuthenticated, async (req, res) => {
  try {
    const payment = req.body.payment;
    const paymentId = payment.identifier;
    const txid = payment.transaction && payment.transaction.txid;
    const txURL = payment.transaction && payment.transaction._link;

    // find the incomplete order
    const order = await Order.findOne({ pi_payment_id: paymentId });

    // order doesn't exist
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    // check the transaction on the Pi blockchain
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
    const paymentIdOnBlock = horizonResponse.data.memo;

    // and check other data as well e.g. amount
    if (paymentIdOnBlock !== order.pi_payment_id) {
      return res.status(400).json({ message: "Payment id doesn't match." });
    }

    // mark the order as paid
    await Order.updateOne(
      { pi_payment_id: paymentId },
      { $set: { txid, paid: true } }
    );


    // increment user balance
  const currentUser = req.currentUser;

    if (currentUser) {
      await User.updateOne({ uid: currentUser.uid }, { $inc: { balance: order.amount } });
    }

  

    // let Pi Servers know that the payment is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
    return res
      .status(200)
      .json({ message: `Handled the incomplete payment ${paymentId}` });
  } catch (error) {
    console.error("Error in /incomplete route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// approve the current payment
router.post("/approve", isAuthenticated, async (req, res) => {
  try {
    console.log("user hitted approve route");

    // console.log("-----------current user from approve--------");
    // console.log(req.currentUser);
    // console.log("jwt id for userId: " + req.currentUser.uid);
    // console.log("-----------current user from approve--------");

    if (!req.currentUser) {
      return res
        .status(401)
        .json({
          error: "unauthorized",
          message: "User needs to sign in first",
        });
    }

    const paymentId = req.body.paymentId;
    const currentPayment = await platformAPIClient.get(
      `/v2/payments/${paymentId}`
    );

 
   
      //creating new order to store payment deatils

    await Order.create({
      pi_payment_id: paymentId,
      product_id: currentPayment.data.metadata.productId,
      user: req.currentUser.uid,
      txid: null,
      paid: false,
      cancelled: false,
      created_at: new Date(),
      amount: currentPayment.data.amount,
    });

    // notifying pi server to approve payment
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);

    return res
      .status(200)
      .json({ message: `Approved the payment ${paymentId}` });
  } catch (error) {
    console.error("Error in /approve route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// completing current payment
router.post("/complete", isAuthenticated, async (req, res) => {
  try {
    if (!req.currentUser) {
      return res
        .status(401)
        .json({
          error: "unauthorized",
          message: "User needs to sign in first",
        });
    }

    const paymentId = req.body.paymentId;
    const txid = req.body.txid;
    const currentPayment = await platformAPIClient.get(
      `/v2/payments/${paymentId}`
    );

    //finalyzing current payment and marking it complete (paid) in db

    await Order.updateOne(
      { pi_payment_id: paymentId },
      { $set: { txid: txid, paid: true } }
    );

    // console.log("***********form complete***************");
    // console.log(req.currentUser);
    // console.log("***********form complete***************");

    const currentUser = req.currentUser;

    const amountToAdd = parseInt(currentPayment.data.amount, 10) || 0;

    console.log(
      "***********amount user is deposting to app***************"
    );
    console.log(
      "this is actual amount withou edit : ",
      currentPayment.data.amount
    );
    // console.log("this is type of amount : ", typeof currentPayment.data.amount);
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    // console.log("this is actual amount from gpt : ", amountToAdd);
    // console.log("this is type of amount : ", typeof amountToAdd);
    // console.log(
    //   "***********amount user is deposting to app***************"
    // );

    // notifying pi server that transaction is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
    await User.updateOne(
      { uid: currentUser.uid },
      { $inc: { balance: currentPayment.data.amount } }
    );

    return res
      .status(200)
      .json({ message: `Completed the payment ${paymentId}` });
  } catch (error) {
    console.error("Error in /complete route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// handle the cancelled payment
router.post("/cancelled_payment", async (req, res) => {
  try {
    const paymentId = req.body.paymentId;

    // marking transaction cancelled 
    await Order.updateOne(
      { pi_payment_id: paymentId },
      { $set: { cancelled: true } }
    );

    return res
      .status(200)
      .json({ message: `Cancelled the payment ${paymentId}` });
  } catch (error) {
    console.error("Error in /cancelled_payment route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
