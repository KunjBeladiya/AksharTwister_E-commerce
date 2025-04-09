const express = require("express");
const router = express.Router();
const path = require('path');
const authMiddleware = require("../middlewares/AuthMiddleware.js");
const {viewCart , updateCartProduct , deleteCartProduct } = require("../controllers/cartController.js")


router.get("/data" , authMiddleware , viewCart);

router.put("/dataupdate" , authMiddleware , updateCartProduct);

router.delete("/delete/:itemId", authMiddleware, deleteCartProduct);



router.get("/" , authMiddleware , (req ,res) => {
    res.sendFile(path.join(__dirname , "../../../Frontend/pages/viewCart.html"));
});

module.exports = router;