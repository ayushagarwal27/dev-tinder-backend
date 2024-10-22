const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    const { userId, email } = req.body.user;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.send({ user });
  } catch (err) {
    res.status(500).send("Something Went Wrong!");
  }
});

module.exports = router;
