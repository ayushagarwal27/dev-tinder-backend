require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

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
