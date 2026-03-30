const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboard,
  getUsers,
  getOrders,
  deleteOrder,
} = require("../controllers/adminController");

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboard);
router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/orders", authMiddleware, adminMiddleware, getOrders);
router.delete("/orders/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;