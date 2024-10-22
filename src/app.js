const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected ", err);
  });
