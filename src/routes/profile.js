const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditData } = require("../utils/validation");

const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    const { userId, email } = req.user;
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

router.patch("/edit", userAuth, validateEditData, async (req, res) => {
  const body = req.body;

  const loggedInUser = req.user;
  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

  try {
    const user = await User.findByIdAndUpdate(
      { _id: loggedInUser.userId },
      { ...body },
      { new: true },
    );
    res.send({ user });
  } catch (err) {
    res.status(500).send("Something Went Wrong!");
  }
});

module.exports = router;
