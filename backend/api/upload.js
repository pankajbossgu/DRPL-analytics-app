const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const processData = require("../services/processData");

const router = express.Router();

const REQUIRED_HEADERS = [
  "Store_Name",
  "Order_ID",
  "Order_Date",
  "Order_Status",
  "Product_Name",
  "Order_Amount",
];

const uploadsDir = path.join(__dirname, "../tmp-uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isCsv =
      file.mimetype === "text/csv" || path.extname(file.originalname).toLowerCase() === ".csv";

    if (!isCsv) {
      return cb(new Error("Invalid file type. Only CSV files are allowed."));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const parseCsvFile = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });

const getMissingHeaders = (headers) => {
  const normalizedHeaders = headers.map((header) => String(header).trim());
  return REQUIRED_HEADERS.filter((header) => !normalizedHeaders.includes(header));
};

router.post("/", upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Missing file. Please upload a CSV file." });
  }

  try {
    const parsedRows = await parseCsvFile(req.file.path);

    if (!parsedRows.length) {
      return res.status(400).json({ error: "CSV file is empty." });
    }

    const incomingHeaders = Object.keys(parsedRows[0]);
    const missingHeaders = getMissingHeaders(incomingHeaders);

    if (missingHeaders.length) {
      return res.status(400).json({
        error: "Invalid CSV headers.",
        missingFields: missingHeaders,
      });
    }

    const cleanedData = await processData(parsedRows);

    return res.status(200).json({
      message: "File uploaded and parsed successfully.",
      totalRecords: cleanedData.length,
      data: cleanedData,
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
