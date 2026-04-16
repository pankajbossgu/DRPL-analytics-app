let latestProcessedRows = [];

const setRows = (rows = []) => {
  latestProcessedRows = Array.isArray(rows) ? rows : [];
};

const getRows = () => latestProcessedRows;

module.exports = {
  setRows,
  getRows,
};
