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

module.exports = { validateSignupData };
