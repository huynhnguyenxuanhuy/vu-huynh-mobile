const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingInfo: {
      fullName: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "done", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);