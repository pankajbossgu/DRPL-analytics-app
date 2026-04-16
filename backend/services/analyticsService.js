const getDeliveryStats = async () => {
  // Placeholder: aggregate stats from Orders collection.
  return {
    totalOrders: 1248,
    delivered: 988,
    pending: 190,
    inTransit: 70,
  };
};

const getAverageDeliveryTime = async () => {
  // Placeholder: compute average from historical delivery durations.
  return {
    averageDeliveryTime: 36.5,
    unit: "minutes",
  };
};

module.exports = {
  getDeliveryStats,
  getAverageDeliveryTime,
};
