const statusMappingStore = require("../services/statusMappingStore");

const getStatusMappings = async (req, res, next) => {
  try {
    const clientId = req.query.clientId || "demo-client";
    const mappings = await statusMappingStore.getByClientId(clientId);

    return res.status(200).json({ success: true, data: mappings });
  } catch (error) {
    return next(error);
  }
};

const saveStatusMappings = async (req, res, next) => {
  try {
    const clientId = req.body.clientId || "demo-client";
    const mappings = Array.isArray(req.body.mappings) ? req.body.mappings : [];

    if (!mappings.length) {
      return res.status(400).json({ success: false, error: "mappings array is required." });
    }

    const saved = await statusMappingStore.saveMappings(mappings, clientId);

    return res.status(200).json({
      success: true,
      message: "Mappings saved successfully.",
      data: saved,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStatusMappings,
  saveStatusMappings,
};
