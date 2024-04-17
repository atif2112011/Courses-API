const jwt = require("jsonwebtoken");
const { GetUserByID } = require("../sql/db_functions");
// require("dotenv").config();
module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization"))
      return res.send({
        success: false,
        message: "Authorization Header missing ...Auth failed",
      });
    //get token from header
    const token = req.header("Authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, "jwtsecret");
    const UserId = decryptedToken.id;
    const user = await GetUserByID({
      id: UserId,
    });
    if (user.isadmin == false)
      return res.send({
        success: false,
        message: "No Admin Access",
      });
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
