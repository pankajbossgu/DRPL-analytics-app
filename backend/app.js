const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reportRoutes = require("./routes/reportRoutes");
const statusMappingRoutes = require("./routes/statusMappingRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "DRPL Analytics API Running" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/status-mappings", statusMappingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
