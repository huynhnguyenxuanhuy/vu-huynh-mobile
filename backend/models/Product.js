const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x220?text=Phone",
    },
    description: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "Other",
    },
    countInStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);