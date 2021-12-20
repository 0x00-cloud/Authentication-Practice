const router = require("express").Router();

module.exports = router;

router.get("/profile", async (req, res) => {
  res.send("user profile");
});
