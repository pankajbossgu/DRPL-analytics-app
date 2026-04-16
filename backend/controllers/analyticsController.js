const { generateAnalytics } = require("../services/analyticsService");
const reportSessionStore = require("../services/reportSessionStore");

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = generateAnalytics(reportSessionStore.getRows(), req.query || {});

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
