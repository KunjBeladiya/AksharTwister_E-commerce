const express = require("express");
const path = require("path");
const authMiddleware = require("../middlewares/AuthMiddleware.js");
const AdminAuthMiddleware = require("../middlewares/AdminAuthMiddleware.js");
const prisma = require("../db/index.js");
const {createOrder , getAllOrdersForAdmin , getOrderForAdmin , updateOrderStatus } = require("../controllers/orderController.js");

const router = express.Router();

router.post("/create" , authMiddleware , createOrder );
router.get("/view" , AdminAuthMiddleware , getAllOrdersForAdmin );
router.get("/detail/:orderId" , AdminAuthMiddleware , getOrderForAdmin );
router.put("/updateOrder/:orderId" , AdminAuthMiddleware , updateOrderStatus);

module.exports = router;
