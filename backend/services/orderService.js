const reportSessionStore = require("./reportSessionStore");

const getAllOrders = async () => {
  const rows = reportSessionStore.getRows();

  return rows.map((row) => ({
    id: row.Order_ID,
    status: row.mapped_status,
    rawStatus: row.raw_order_status,
    store: row.Store_Name,
    courier: row.Courier_Name,
    paymentType: row.Payment_Type,
    orderAmount: row.Order_Amount,
    profit: row.row_profit,
    marginPercent: row.row_margin_percent,
    createdAt: row.Order_Date,
  }));
};

const createOrder = async (_payload) => {
  throw new Error("Manual order creation is disabled for report-driven MVP flow.");
};

module.exports = {
  getAllOrders,
  createOrder,
};
