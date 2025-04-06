const express = require("express");
const path = require("path");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth,
  checkUserRegistered,
  getUserData,
  changeuserdata,
  updatePassword
} = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/AuthMiddleware.js");
const prisma = require("../db/index.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware, logoutUser);
router.get("/checkAuth", authMiddleware, checkUserAuth);
router.post("/checkUser", checkUserRegistered);

router.get("/profile/data", authMiddleware , getUserData);
router.put("/profile/update" , authMiddleware , changeuserdata);
router.put("/profile/updatePassword" , authMiddleware , updatePassword);

router.get("/register" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/signup.html"));
})

router.get("/login" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/login.html"));
})

router.get("/account" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/account.html"));
})

router.get("/profile" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/profile.html"));
})

router.get("/order" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/order.html"));
})

router.get("/cart" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/cart.html"));
})

router.get("/address" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/address.html"));
})

router.get("/contactPage" , (req,res) => {
  res.sendFile(path.join(__dirname , "../../../Frontend/pages/contact.html"));
})



module.exports = router;
