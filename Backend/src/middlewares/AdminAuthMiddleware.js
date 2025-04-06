const jwt = require("jsonwebtoken");
const path = require('path');

const AdminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.admintoken;

  try {
    if (!token)
      return res.sendFile(path.join(__dirname , "../../../Frontend/pages/adminlogin.html"));

    const decoded = jwt.verify(token, process.env.SECERET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log("error in auth  admin middleware", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid token or token is expired" });
  }
};

module.exports = AdminAuthMiddleware;
