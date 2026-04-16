const express = require("express");
const uploadRoute = require("../api/upload");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.use("/upload", uploadRoute);
router.post("/recalculate", reportController.recalculateReport);

module.exports = router;
