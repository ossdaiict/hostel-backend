const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.isSupervisor === true) {
      req.user = decoded;
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};
