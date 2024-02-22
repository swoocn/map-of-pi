const Shop = require("../models/shopModel");
const User = require("../models/userModel");
const platformAPIClient = require("../services/platformAPIClient");
const jwt = require("jsonwebtoken");

const signInUser = async (req, res) => {
  const authResult = req.body.authResult;

  try {
    const me = await platformAPIClient.get("/v2/me", {
      headers: { Authorization: `Bearer ${authResult.accessToken}` },
    });
    console.log("User details from /me endpoint:", me.data);
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }

  try {
    let currentUser = await User.findOne({ uid: authResult.user.uid });
    if (!currentUser) {
      const newUser = new User({
        username: authResult.user.username,
        uid: authResult.user.uid,
        roles: authResult.user.roles,
        accessToken: authResult.accessToken,
        shops: []
      });

      currentUser = await newUser.save();
    }

    const userShops = await Shop.find({ owner: currentUser.uid });
 
    currentUser.shops = userShops;

    await currentUser.save(); 
    
    const token = jwt.sign(
      { userId: currentUser.uid },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );
    res.status(200).json({ currentUser, token });
  } catch (error) {
    console.log("Internal server error: " + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const signOutUser = async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({ uid: decoded.userId });
    await User.findOneAndUpdate(
      { uid: currentUser.uid },
      { accessToken: null }
    );
    res.status(200).json({
      message: "User signed out",
      todo: "remember to remove user token from localstorage",
    });
  } catch (error) {
    console.log("Internal server error: " + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyUserToken = async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findOne({ uid: decoded.userId });

    res.status(200).json({ currentUser, token });
  } catch (error) {
    console.log(
      "internal server error while verifying user token",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signInUser,
  signOutUser,
  verifyUserToken,
};
