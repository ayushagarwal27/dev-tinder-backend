const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
    });
    res.json(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const body = req.body;

  try {
    const { email, password } = body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("not valid email or password");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.json({ message: "Logged in Successfully!" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  res.send("logged out");
});

module.exports = router;
