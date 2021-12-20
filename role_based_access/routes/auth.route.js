const router = require("express").Router();
const User = require("../models/user.model");
router.get("/login", async (req, res, nextEditor) => {
  res.render("auth/login");
});

router.get("/register", async (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const doesExit = await User.findOne({ email });
    if (doesExit) {
      res.redirect("/auth/register");
      return;
    }
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  res.send("login post");
});

router.get("/logout", async (req, res, next) => {});
module.exports = router;
