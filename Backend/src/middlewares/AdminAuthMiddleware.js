const jwt = require("jsonwebtoken");
const path = require("path");

const AdminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.admintoken;

  try {
    if (!token) {
      return res.sendFile(
        path.join(__dirname, "../../../Frontend/pages/adminlogin.html")
      );
    }

    const decoded = jwt.verify(token, process.env.SECERET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log("Error in auth admin middleware", error);

    if (error.name === "TokenExpiredError") {
      // Redirect to login page if the token has expired
      return res.redirect("/adminlogin.html"); // Adjust the route as per your setup
    }

    res
      .status(401)
      .json({ success: false, message: "Invalid token or token is expired" });
  }
};

module.exports = AdminAuthMiddleware;
