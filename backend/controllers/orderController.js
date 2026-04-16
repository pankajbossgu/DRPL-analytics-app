const orderService = require("../services/orderService");

const getOrders = async (_req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  createOrder,
};
