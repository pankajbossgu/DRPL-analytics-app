const mockOrders = require("../data/mockOrders");

let orderStore = [...mockOrders];

const getAllOrders = async () => {
  // Placeholder: replace mock store with DB query in future.
  return orderStore;
};

const createOrder = async (payload) => {
  // Placeholder: add validation/business rules once requirements are finalized.
  const newOrder = {
    id: payload.id || `ORD-${Date.now()}`,
    status: payload.status || "Pending",
    deliveryTime: payload.deliveryTime || 0,
    location: payload.location || "Unknown",
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  orderStore = [newOrder, ...orderStore];
  return newOrder;
};

module.exports = {
  getAllOrders,
  createOrder,
};
