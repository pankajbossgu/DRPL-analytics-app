const { CATEGORIES } = require("./statusMapper");

const applyFilters = (rows = [], filters = {}) => {
  const {
    startDate,
    endDate,
    store,
    courier,
    paymentType,
    mappedStatus,
    product,
    category,
  } = filters;

  return rows.filter((row) => {
    const rowDate = row.Order_Date ? new Date(row.Order_Date) : null;
    if (startDate && rowDate && rowDate < new Date(startDate)) return false;
    if (endDate && rowDate && rowDate > new Date(endDate)) return false;

    if (store && row.Store_Name !== store) return false;
    if (courier && row.Courier_Name !== courier) return false;
    if (paymentType && row.Payment_Type !== paymentType) return false;
    if (mappedStatus && row.mapped_status !== mappedStatus) return false;
    if (product && row.Product_Name !== product) return false;
    if (category && row.Category !== category) return false;

    return true;
  });
};

const buildGroupSummary = (rows, keyField) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const key = row[keyField] || "UNKNOWN";
    const entry = grouped.get(key) || {
      key,
      orders: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
    };

    entry.orders += 1;
    entry.revenue += row.row_revenue;
    entry.cost += row.row_total_cost;
    entry.profit += row.row_profit;

    grouped.set(key, entry);
  });

  return Array.from(grouped.values()).map((entry) => ({
    ...entry,
    marginPercent: entry.revenue > 0 ? Number(((entry.profit / entry.revenue) * 100).toFixed(2)) : 0,
  }));
};

const buildDateTrend = (rows) => {
  const byDate = new Map();

  rows.forEach((row) => {
    const dateKey = row.Order_Date || "UNKNOWN";
    const entry = byDate.get(dateKey) || {
      date: dateKey,
      delivered: 0,
      inTransit: 0,
      ndr: 0,
      rto: 0,
      other: 0,
      orders: 0,
      revenue: 0,
      profit: 0,
    };

    entry.orders += 1;
    entry.revenue += row.row_revenue;
    entry.profit += row.row_profit;

    if (row.mapped_status === CATEGORIES.DELIVERED) entry.delivered += 1;
    else if (row.mapped_status === CATEGORIES.IN_TRANSIT) entry.inTransit += 1;
    else if (row.mapped_status === CATEGORIES.NDR) entry.ndr += 1;
    else if (row.mapped_status === CATEGORIES.RTO) entry.rto += 1;
    else entry.other += 1;

    byDate.set(dateKey, entry);
  });

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const generateAnalytics = (rows = [], filters = {}) => {
  const filteredRows = applyFilters(rows, filters);

  const statusCounts = {
    [CATEGORIES.DELIVERED]: 0,
    [CATEGORIES.IN_TRANSIT]: 0,
    [CATEGORIES.NDR]: 0,
    [CATEGORIES.RTO]: 0,
    [CATEGORIES.OTHER]: 0,
  };

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  filteredRows.forEach((row) => {
    const status = row.mapped_status || CATEGORIES.OTHER;
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    totalRevenue += row.row_revenue;
    totalCost += row.row_total_cost;
    totalProfit += row.row_profit;
  });

  const deliveryDenominator =
    statusCounts[CATEGORIES.DELIVERED] +
    statusCounts[CATEGORIES.IN_TRANSIT] +
    statusCounts[CATEGORIES.NDR] +
    statusCounts[CATEGORIES.RTO];

  const deliveryPercent =
    deliveryDenominator > 0
      ? Number(((statusCounts[CATEGORIES.DELIVERED] / deliveryDenominator) * 100).toFixed(2))
      : 0;

  return {
    metrics: {
      totalOrders: filteredRows.length,
      delivered: statusCounts[CATEGORIES.DELIVERED],
      inTransit: statusCounts[CATEGORIES.IN_TRANSIT],
      ndr: statusCounts[CATEGORIES.NDR],
      rto: statusCounts[CATEGORIES.RTO],
      other: statusCounts[CATEGORIES.OTHER],
      deliveryPercent,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      avgOrderValue: filteredRows.length ? Number((totalRevenue / filteredRows.length).toFixed(2)) : 0,
      marginPercent: totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(2)) : 0,
    },
    storeWise: buildGroupSummary(filteredRows, "Store_Name"),
    courierWise: buildGroupSummary(filteredRows, "Courier_Name"),
    paymentTypeSummary: buildGroupSummary(filteredRows, "Payment_Type"),
    dateWiseTrend: buildDateTrend(filteredRows),
    statusSummary: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    tableRows: filteredRows,
  };
};

module.exports = {
  generateAnalytics,
};
