const { mapStatus, getUnknownStatuses, normalizeStatus } = require("./statusMapper");

const REQUIRED_FIELDS = [
  "Store_Name",
  "Order_ID",
  "Order_Date",
  "Order_Status",
  "Product_Name",
  "Order_Qty",
  "Payment_Type",
  "Courier_Name",
  "Order_Amount",
];

const TEMPLATE_HEADERS = [
  "Store_Name",
  "Order_ID",
  "Order_Date",
  "Order_Status",
  "Product_Name",
  "Order_Qty",
  "Payment_Type",
  "Courier_Name",
  "Order_Amount",
  "Selling_Price",
  "SKU",
  "Category",
  "Order_Type",
  "AWB_Number",
  "Customer_City",
  "Customer_State",
  "Discount_Amount",
  "Product_Cost",
  "Ad_Spend",
  "Packaging_Cost",
  "Courier_Charge",
  "RTO_Charge",
  "Return_Cost",
  "Handling_Cost",
  "Other_Cost",
  "Tax_Amount",
  "Gateway_Fee",
  "Remarks",
];

const NUMERIC_FIELDS = [
  "Order_Amount",
  "Selling_Price",
  "Discount_Amount",
  "Product_Cost",
  "Ad_Spend",
  "Packaging_Cost",
  "Courier_Charge",
  "RTO_Charge",
  "Return_Cost",
  "Handling_Cost",
  "Other_Cost",
  "Tax_Amount",
  "Gateway_Fee",
];

const COST_FIELDS = [
  "Product_Cost",
  "Ad_Spend",
  "Packaging_Cost",
  "Courier_Charge",
  "RTO_Charge",
  "Return_Cost",
  "Handling_Cost",
  "Other_Cost",
  "Tax_Amount",
  "Gateway_Fee",
];

const toStringValue = (value) => (value === undefined || value === null ? "" : String(value).trim());

const toNumber = (value, fallback = 0) => {
  const normalized = toStringValue(value).replace(/,/g, "");
  if (!normalized) return fallback;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const processData = async (rows = [], options = {}) => {
  const savedMappings = options.savedMappings || [];

  const processedRows = [];
  const missingFieldRows = [];
  const rawStatusCounter = new Map();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const normalizedRow = TEMPLATE_HEADERS.reduce((acc, header) => {
      acc[header] = toStringValue(row[header]);
      return acc;
    }, {});

    normalizedRow.Order_Qty = Math.max(1, toNumber(normalizedRow.Order_Qty, 1));

    NUMERIC_FIELDS.forEach((field) => {
      normalizedRow[field] = toNumber(normalizedRow[field], 0);
    });

    const missingFields = REQUIRED_FIELDS.filter((field) => {
      if (field === "Order_Qty") return normalizedRow[field] <= 0;
      if (field === "Order_Amount") return !Number.isFinite(normalizedRow[field]);
      return !toStringValue(normalizedRow[field]);
    });

    if (missingFields.length) {
      missingFieldRows.push({
        rowNumber,
        missingFields,
      });
    }

    const rawStatus = toStringValue(normalizedRow.Order_Status);
    const mapped = mapStatus(rawStatus, { savedMappings });

    rawStatusCounter.set(rawStatus, (rawStatusCounter.get(rawStatus) || 0) + 1);

    const rowRevenue = normalizedRow.Order_Amount;
    const rowTotalCost = COST_FIELDS.reduce((sum, field) => sum + normalizedRow[field], 0);
    const rowProfit = rowRevenue - rowTotalCost;
    const rowMarginPercent = rowRevenue > 0 ? Number(((rowProfit / rowRevenue) * 100).toFixed(2)) : 0;

    processedRows.push({
      ...normalizedRow,
      row_number: rowNumber,
      raw_order_status: rawStatus,
      normalized_order_status: normalizeStatus(rawStatus),
      mapped_status: mapped.mappedCategory,
      status_source: mapped.source,
      row_revenue: rowRevenue,
      row_total_cost: rowTotalCost,
      row_profit: rowProfit,
      row_margin_percent: rowMarginPercent,
    });
  });

  const detectedRawStatuses = Array.from(rawStatusCounter.entries()).map(([rawStatus, orderCount]) => {
    const mapped = mapStatus(rawStatus, { savedMappings });
    return {
      rawStatus,
      normalizedStatus: mapped.normalizedStatus,
      autoMappedTo: mapped.mappedCategory,
      source: mapped.source,
      orderCount,
    };
  });

  return {
    processedRows,
    uploadSummary: {
      totalRows: rows.length,
      validRows: processedRows.length - missingFieldRows.length,
      invalidRows: missingFieldRows.length,
      missingRequiredFieldRows: missingFieldRows.length,
    },
    missingFieldRows,
    detectedRawStatuses,
    unmappedStatuses: getUnknownStatuses(processedRows, savedMappings),
  };
};

module.exports = {
  processData,
  TEMPLATE_HEADERS,
  REQUIRED_FIELDS,
};
