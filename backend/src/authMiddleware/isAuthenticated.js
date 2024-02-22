const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log("token: " + token);

  if (!token) {
    console.log("Map of pi says u are not authenticated");
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({ uid: decodedToken.userId });

    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.currentUser = currentUser;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid token", details: error.message });
  }
};

module.exports = isAuthenticated;
