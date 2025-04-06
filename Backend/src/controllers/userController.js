const bcrypt = require("bcryptjs");
const prisma = require("../db/index.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("registering..");

  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Email alredy exist" });

    const hashedpassword = await bcrypt.hash(password, 8);

    const newuser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedpassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "User create successfully",
      user: newuser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, typeof email);
    console.log(password, typeof password);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return res.json({ success: false, message: "user does not exist" });

    console.log(user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECERET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      HttpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "user Successfully logged in" });
  } catch (error) {
    console.log("error in login ", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const checkUserAuth = async (req, res) => {
  return res.json({
    success: true,
    message: "User is already logged in",
    user: req.user, // Send user data
  });
};

const checkUserRegistered = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email alredy exist" });
    } else {
      return res.status(200).json({ success: true, message: "user not exist" });
    }
  } catch (error) {
    console.log("error in checkUser", error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const getUserData = async (req, res) => {
  const userdata = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });

  res.json({ success:true ,user:userdata});
};

const changeuserdata = async (req, res) => {
  const { name, phone } = req.body;

  try {
      // Check if both name and phone are missing
      if (!name && !phone) {
          return res.status(400).json({ success: false, message: "No data provided for update" });
      }

      const updatedUser = await prisma.user.update({
          where: { id: req.user.userId },
          data: { ...(name && { name }), ...(phone && { phone }) },
      });

      return res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
      console.error("Error updating user data:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    const isPasswordvalid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordvalid) {
      return res
        .status(400)
        .json({ success: false, message: "old password is incorrect" });
    }

    if (newPassword != confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "new password does not match" });
    }

    const hashedpassword = await bcrypt.hash(newPassword, 8);

    const updateUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        password: hashedpassword,
      },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Password updated successfully",
        user: updateUser,
      });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth,
  checkUserRegistered,
  getUserData,
  changeuserdata,
  updatePassword
};
