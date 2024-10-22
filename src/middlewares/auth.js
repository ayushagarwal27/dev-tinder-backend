const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const { userId, email } = await jwt.verify(token, "JWT_SECRET");
    req.body.user = { userId, email };
    next();
  } catch (err) {
    res.status(401).json({ message: "Not Authenticated" });
  }
};

module.exports = { userAuth };
