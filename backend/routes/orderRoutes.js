const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);

module.exports = router;