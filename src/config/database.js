const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://todo:pass123@first.fhlee.mongodb.net/devTinder"
  );
}

module.exports = connectDB;
