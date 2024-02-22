const express = require("express");
const {
  signInUser,
  signOutUser,
  verifyUserToken,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/signIn", signInUser);
router.post("/signOut", signOutUser);
router.post("/verify-token", verifyUserToken);

module.exports = router;
