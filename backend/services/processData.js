const FIELDS_TO_TRIM = [
  "Store_Name",
  "Order_ID",
  "Order_Date",
  "Order_Status",
  "Product_Name",
  "Order_Amount",
];

const FIELDS_TO_LOWERCASE = ["Store_Name", "Order_Status", "Product_Name"];

function normalizeValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

async function processData(rows = []) {
  return rows.map((row) => {
    const cleanedRow = { ...row };

    FIELDS_TO_TRIM.forEach((field) => {
      cleanedRow[field] = normalizeValue(cleanedRow[field]);
    });

    FIELDS_TO_LOWERCASE.forEach((field) => {
      if (cleanedRow[field]) {
        cleanedRow[field] = cleanedRow[field].toLowerCase();
      }
    });

    return cleanedRow;
  });
}

module.exports = processData;
