const Product = require("../models/Product");

const buildProductPayload = (body, file, existingImage = "") => {
  const uploadedImage = file
    ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    : "";

  const payload = {
    name: body.name,
    price: Number(body.price || 0),
    image: uploadedImage || body.image || existingImage,
    description: body.description || "",
    brand: body.brand || "Other",
    countInStock: Number(body.countInStock || 0),
  };

  return payload;
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(buildProductPayload(req.body, req.file));
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payload = buildProductPayload(req.body, req.file, product.image);

    product.name = payload.name ?? product.name;
    product.price = payload.price ?? product.price;
    product.image = payload.image ?? product.image;
    product.description = payload.description ?? product.description;
    product.brand = payload.brand ?? product.brand;
    product.countInStock = payload.countInStock ?? product.countInStock;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
