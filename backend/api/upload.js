const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const { processData, TEMPLATE_HEADERS, REQUIRED_FIELDS } = require("../services/processData");
const { generateAnalytics } = require("../services/analyticsService");
const statusMappingStore = require("../services/statusMappingStore");
const reportSessionStore = require("../services/reportSessionStore");

const router = express.Router();

const uploadsDir = path.join(__dirname, "../tmp-uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isCsv =
      file.mimetype.includes("csv") || path.extname(file.originalname || "").toLowerCase() === ".csv";

    if (!isCsv) {
      return cb(new Error("Invalid file type. Please upload a .csv file."));
    }

    return cb(null, true);
  },
});

const parseCsvFile = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => String(header || "").trim(),
          mapValues: ({ value }) => (value === undefined || value === null ? "" : String(value).trim()),
          skipLines: 0,
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });

const validateHeaders = (row = {}) => {
  const incomingHeaders = Object.keys(row).map((item) => String(item).trim());
  const missingRequiredHeaders = REQUIRED_FIELDS.filter((field) => !incomingHeaders.includes(field));

  return {
    incomingHeaders,
    missingRequiredHeaders,
    unsupportedHeaders: incomingHeaders.filter((header) => !TEMPLATE_HEADERS.includes(header)),
  };
};

router.post("/", upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Missing file. Please upload CSV using field name 'file'." });
  }

  const clientId = req.body.clientId || "demo-client";

  try {
    const parsedRows = await parseCsvFile(req.file.path);

    if (!parsedRows.length) {
      return res.status(400).json({ error: "CSV file is empty." });
    }

    const headerCheck = validateHeaders(parsedRows[0]);

    if (headerCheck.missingRequiredHeaders.length) {
      return res.status(400).json({
        error: "CSV template validation failed. Missing mandatory headers.",
        missingHeaders: headerCheck.missingRequiredHeaders,
        requiredHeaders: REQUIRED_FIELDS,
      });
    }

    const savedMappings = await statusMappingStore.getByClientId(clientId);

    const processingResult = await processData(parsedRows, { savedMappings });
    const analytics = generateAnalytics(processingResult.processedRows);
    reportSessionStore.setRows(processingResult.processedRows);

    return res.status(200).json({
      success: true,
      message: "File uploaded and report preview generated.",
      templateInfo: {
        incomingHeaders: headerCheck.incomingHeaders,
        unsupportedHeaders: headerCheck.unsupportedHeaders,
      },
      ...processingResult,
      analytics,
    });
  } catch (error) {
    return next(error);
  } finally {
    if (req.file?.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
  }
});

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error && error.message) {
    return res.status(400).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
