const express = require("express");
const nodemailer = require("nodemailer");
const session = require("express-session");

const app = express();
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
async function sendOTPEmail(userEmail, otp) {
  const mailOptions = {
    from: process.env.USER,
    to: userEmail,
    subject: "Your OTP Code for Verification",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", userEmail);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

// verify/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  req.session.otp = otp; // Store OTP in session
  console.log("send-otp" , req.session.otp);

  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent to email" });
});


router.post("/otp", (req, res) => {
  const { otp } = req.body;

  console.log("Received OTP:",typeof req.body.otp);
  console.log("Received OTP:",typeof parseInt(otp));
  console.log("Stored OTP in session:",typeof req.session.otp);

  if (!otp) return res.status(400).json({ success:false , message: "OTP is required!" });

  if ( parseInt(otp) === parseInt(req.session.otp)) {
    req.session.otp = null; // Clear OTP after successful verification
    return res.json({ success:true , message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ success:false , message: "Invalid OTP!" });
  }
});

module.exports = router;
