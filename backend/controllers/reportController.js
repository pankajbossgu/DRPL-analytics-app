const { processData } = require("../services/processData");
const { generateAnalytics } = require("../services/analyticsService");
const statusMappingStore = require("../services/statusMappingStore");
const reportSessionStore = require("../services/reportSessionStore");

const recalculateReport = async (req, res, next) => {
  try {
    const clientId = req.body.clientId || "demo-client";
    const processedRows = Array.isArray(req.body.processedRows) ? req.body.processedRows : [];
    const mappingOverrides = Array.isArray(req.body.mappingOverrides) ? req.body.mappingOverrides : [];
    const filters = req.body.filters || {};

    if (!processedRows.length) {
      return res.status(400).json({
        success: false,
        error: "processedRows is required for recalculation.",
      });
    }

    const savedMappings = await statusMappingStore.getByClientId(clientId);
    const mergedMappings = [...savedMappings, ...mappingOverrides];

    const reprocessed = await processData(processedRows, { savedMappings: mergedMappings });
    const analytics = generateAnalytics(reprocessed.processedRows, filters);
    reportSessionStore.setRows(reprocessed.processedRows);

    return res.status(200).json({
      success: true,
      message: "Report recalculated successfully.",
      ...reprocessed,
      analytics,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  recalculateReport,
};
