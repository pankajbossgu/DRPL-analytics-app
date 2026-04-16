const CATEGORIES = {
  DELIVERED: "DELIVERED",
  IN_TRANSIT: "IN_TRANSIT",
  NDR: "NDR",
  RTO: "RTO",
  OTHER: "OTHER",
};

const SYSTEM_STATUS_KEYWORDS = {
  [CATEGORIES.DELIVERED]: [
    "delivered",
    "shipment delivered",
    "successfully delivered",
    "pod delivered",
  ],
  [CATEGORIES.IN_TRANSIT]: [
    "in transit",
    "shipped",
    "manifested",
    "dispatched",
    "pickup completed",
    "picked up",
    "bagged",
    "reached hub",
    "arrived at facility",
    "out for delivery",
    "ofd",
  ],
  [CATEGORIES.NDR]: [
    "ndr",
    "customer not available",
    "customer unreachable",
    "phone not reachable",
    "refused delivery",
    "refused",
    "address incorrect",
    "address incomplete",
    "premises closed",
    "delivery attempt failed",
    "otp not shared",
    "reschedule requested",
    "cod not ready",
  ],
  [CATEGORIES.RTO]: [
    "rto",
    "return to origin",
    "rto initiated",
    "rto in transit",
    "rto delivered",
    "undelivered returned",
    "shipment returned",
  ],
  [CATEGORIES.OTHER]: [
    "cancelled",
    "payment failed",
    "new order",
    "pending pickup",
    "pickup error",
    "lost",
    "damaged",
    "delayed",
    "return initiated",
    "returned",
  ],
};

const normalizeStatus = (rawStatus = "") =>
  String(rawStatus)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const buildNormalizedMap = (mappings = []) => {
  const map = new Map();

  mappings.forEach((entry) => {
    if (!entry) return;

    const normalized = normalizeStatus(entry.rawStatus || entry.normalizedStatus);
    const mappedCategory = String(entry.mappedCategory || "").trim().toUpperCase();

    if (!normalized || !CATEGORIES[mappedCategory]) return;

    map.set(normalized, mappedCategory);
  });

  return map;
};

const resolveBySystemMapping = (normalizedStatus) => {
  const entries = Object.entries(SYSTEM_STATUS_KEYWORDS);

  for (const [category, keywords] of entries) {
    for (const keyword of keywords) {
      if (normalizedStatus === keyword || normalizedStatus.includes(keyword)) {
        return category;
      }
    }
  }

  return null;
};

const mapStatus = (rawStatus, options = {}) => {
  const normalizedStatus = normalizeStatus(rawStatus);
  const clientMap = buildNormalizedMap(options.savedMappings || []);

  if (!normalizedStatus) {
    return {
      rawStatus: rawStatus || "",
      normalizedStatus,
      mappedCategory: CATEGORIES.OTHER,
      source: "fallback",
    };
  }

  if (clientMap.has(normalizedStatus)) {
    return {
      rawStatus,
      normalizedStatus,
      mappedCategory: clientMap.get(normalizedStatus),
      source: "client_saved",
    };
  }

  const systemCategory = resolveBySystemMapping(normalizedStatus);
  if (systemCategory) {
    return {
      rawStatus,
      normalizedStatus,
      mappedCategory: systemCategory,
      source: "system",
    };
  }

  return {
    rawStatus,
    normalizedStatus,
    mappedCategory: CATEGORIES.OTHER,
    source: "fallback",
  };
};

const getUnknownStatuses = (rows = [], mappings = []) => {
  const mapped = buildNormalizedMap(mappings);
  const unknownMap = new Map();

  rows.forEach((row) => {
    const rawStatus = row.Order_Status || row.raw_order_status || "";
    const normalizedStatus = normalizeStatus(rawStatus);
    if (!normalizedStatus) return;

    if (mapped.has(normalizedStatus)) return;

    const systemCategory = resolveBySystemMapping(normalizedStatus);
    if (!systemCategory) {
      const count = unknownMap.get(rawStatus) || 0;
      unknownMap.set(rawStatus, count + 1);
    }
  });

  return Array.from(unknownMap.entries()).map(([rawStatus, orderCount]) => ({
    rawStatus,
    normalizedStatus: normalizeStatus(rawStatus),
    orderCount,
    mappedCategory: CATEGORIES.OTHER,
  }));
};

module.exports = {
  CATEGORIES,
  normalizeStatus,
  mapStatus,
  getUnknownStatuses,
};
