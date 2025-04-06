const express = require("express");
const {adminLogin , registerAdmin , checkAdminAuth , adminLogout , addProduct , getProductDetail, updateProduct, deleteProduct} = require("../controllers/adminController.js")
const AdminAuthMiddleware = require("../middlewares/AdminAuthMiddleware.js");
const upload = require("../middlewares/upload.js");
const path = require("path");

const router = express.Router();

router.post("/register" , registerAdmin);
router.post("/login" , adminLogin);
router.get("/auth" , AdminAuthMiddleware ,checkAdminAuth);
router.get("/logout" , AdminAuthMiddleware ,adminLogout);

// add product
router.post('/add/products', upload.single('image'), addProduct);

// Get details of a specific product.
router.get('/get/products/:id' , getProductDetail );

// update product
router.put('/update/products/:id' , updateProduct);

// delete product
router.delete('/delete/products/:id' , deleteProduct);

// get admin page
router.get("/" , AdminAuthMiddleware ,(req,res) => {

     res.sendFile(path.join(__dirname , "../../../Frontend/pages/admin.html"));
})

module.exports = router;