const express = require("express");
const prisma = require("./db/index.js");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 }, // OTP expires in 5 minutes
  })
);

app.use(express.static(path.join(__dirname, "../../Frontend/public")));
app.use(express.static(path.join(__dirname, "../../Frontend/pages")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/pages/home.html"));
});

app.get("/contact" , (req,res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/pages/contact.html"));
});

// Routes
app.use("/verify", require("./routes/verifyRouter"));
app.use("/user" , require("./routes/userRouter.js"));
app.use("/admin" , require("./routes/adminRouter.js"));
app.use("/product" , require("./routes/productRouter.js"));
app.use("/cart" , require("./routes/cartRouter.js"));

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  console.log("Database connection closed.");

  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });
});
