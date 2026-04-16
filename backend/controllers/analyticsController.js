const analyticsService = require("../services/analyticsService");

const getAnalytics = async (_req, res, next) => {
  try {
    const [stats, averageTime] = await Promise.all([
      analyticsService.getDeliveryStats(),
      analyticsService.getAverageDeliveryTime(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        ...averageTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
