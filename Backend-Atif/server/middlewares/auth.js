const jwt = require("jsonwebtoken");
// require("dotenv").config();
module.exports = (req, res, next) => {
  try {
    if (!req.header("Authorization"))
      return res.send({
        success: false,
        message: "Authorization Header missing ...Auth failed",
      });
    //get token from header
    const token = req.header("Authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, "jwtsecret");
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
