const prisma = require("../db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All feilds are required" });

    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (admin)
      return res
        .status(400)
        .json({ success: false, message: "Email alredy exist" });

    const hashedpassword = await bcrypt.hash(password, 8);

    const newadmin = await prisma.admin.create({
      data: {
        name: name,
        email: email,
        password: hashedpassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Admin create successfully",
      user: newadmin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All feilds are required" });

    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (!admin)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isvalidPassword = await bcrypt.compare(password, admin.password);

    if (!isvalidPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.SECERET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("admintoken", token, {
      HttpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "user Successfully logged in" });
  } catch (error) {
    console.log("error in admin login", error);
    res.status(500).json({ success: false, message: "error in admin login" });
  }
};

const checkAdminAuth = async (req, res) => {
  return res.json({
    success: true,
    message: "User is already logged in",
    user: req.user, // Send user data
  });
};

const adminLogout = async (req, res) => {
  res.clearCookie("admintoken");
  res.status(200).json({ success: true, message: "admin logout successfully" });
};

const addProduct = async (req, res) => {
  console.log("run");
  try {
    const { name, description, pricePerKg, stock, color } =
      req.body;

      console.log('Body:', req.body);
      console.log('File:', req.file);

    let imageUrl = req.file ? req.file.path : null; // Cloudinary URL already available here!

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        pricePerKg: parseFloat(pricePerKg),
        stock: parseInt(stock),
        color,
        imageUrl,
      },
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product", error });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: product });
  } catch (error) {
    console.log("error in getproduct detail ", error);
    res
      .status(400)
      .json({ success: false, message: "error in get product detail" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_kg, stock, color, weight_options } =
    req.body;

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price_per_kg,
        stock,
        color,
        weight_options,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return res.status(404).json({ success:false , message: "Product not found" });
    }

    // Delete product
    await prisma.product.delete({
      where: { id: id },
    });

    res.status(200).json({ success:true ,message: "Product deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success:false , message: "Internal server error" });
  }
};

module.exports = {
  adminLogin,
  registerAdmin,
  adminLogout,
  checkAdminAuth,
  addProduct,
  getProductDetail,
  updateProduct,
  deleteProduct
};
