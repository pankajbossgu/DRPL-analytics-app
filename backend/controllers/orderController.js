const orderService = require("../services/orderService");

const getOrders = async (_req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (_req, res) => {
  res.status(405).json({
    success: false,
    error: "Manual order creation is disabled. Upload CSV via /api/reports/upload.",
  });
};

module.exports = {
  getOrders,
  createOrder,
};
