const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email isAdmin")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getOrders,
  deleteOrder,
};