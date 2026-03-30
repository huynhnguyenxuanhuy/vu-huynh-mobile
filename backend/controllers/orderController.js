const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !shippingInfo ||
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin giao hàng" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      shippingInfo,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};