const Httperror = require("../helper/Httperror");
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new Httperror("Authorization failed!", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT);
    req.userData = { userId: decodeData.userId };
    next();
  } catch (error) {
    return next(new Httperror("Authorization failed!", 401));
  }
};
module.exports = auth;
