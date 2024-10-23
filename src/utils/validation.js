const validator = require("validator");

function validateSignupData(req) {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Invalid inputs");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Id");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
}

function validateEditData(req, res, next) {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "avatar_url",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) {
    res.status(401).send("Invalid Edit Request");
    return;
  }
  next();
}

module.exports = { validateSignupData, validateEditData };
