const express = require("express");
const { getProducts , addProductToCart} = require("../controllers/productController.js");
const router = express.Router();
const path = require('path');
const authMiddleware = require("../middlewares/AuthMiddleware.js");

router.get("/" , getProducts);

router.get("/productPage" , (req,res) => {
    res.sendFile(path.join(__dirname , "../../../Frontend/pages/product.html"));
})

router.post("/addtocart" , authMiddleware, addProductToCart );

module.exports = router;