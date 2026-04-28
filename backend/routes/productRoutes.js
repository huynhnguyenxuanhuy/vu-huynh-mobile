const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const uploadProductImage = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadProductImage.single("imageFile"),
  createProduct
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadProductImage.single("imageFile"),
  updateProduct
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
