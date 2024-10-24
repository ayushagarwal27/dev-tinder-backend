const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 4 },
    lastName: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak");
        }
      },
    },
    age: { type: Number },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "ors."],
        message: "{VALUE} is not a valid gender type",
      },
    },
    avatar_url: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url");
        }
      },
    },
    about: { type: String },
    skills: { type: [String] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJWT = async function () {
  return await jwt.sign({ userId: this._id, email: this.email }, "JWT_SECRET", {
    expiresIn: "1d",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
