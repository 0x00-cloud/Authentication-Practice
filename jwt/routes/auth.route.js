const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh-token", (req, res, next) => {
  res.send("refresh token");
});
router.delete("/logout", (req, res, next) => {
  res.send("logout route");
});
module.exports = router;
