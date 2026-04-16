const fs = require("fs");
const path = require("path");
const { normalizeStatus } = require("./statusMapper");

const STORE_PATH = path.join(__dirname, "../storage/statusMappings.json");

const ensureStore = async () => {
  try {
    await fs.promises.access(STORE_PATH, fs.constants.F_OK);
  } catch {
    await fs.promises.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.promises.writeFile(STORE_PATH, "[]", "utf-8");
  }
};

const readAll = async () => {
  await ensureStore();
  const content = await fs.promises.readFile(STORE_PATH, "utf-8");

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = async (mappings) => {
  await ensureStore();
  await fs.promises.writeFile(STORE_PATH, JSON.stringify(mappings, null, 2), "utf-8");
};

const getByClientId = async (clientId = "demo-client") => {
  const all = await readAll();
  return all.filter((item) => item.clientId === clientId);
};

const saveMappings = async (entries = [], clientId = "demo-client") => {
  const all = await readAll();
  const now = new Date().toISOString();
  const normalizedEntries = entries
    .filter((item) => item.rawStatus && item.mappedCategory)
    .map((item) => ({
      clientId,
      rawStatus: String(item.rawStatus).trim(),
      normalizedStatus: normalizeStatus(item.rawStatus),
      mappedCategory: String(item.mappedCategory).trim().toUpperCase(),
      source: item.source || "client_saved",
      createdAt: now,
      updatedAt: now,
    }));

  normalizedEntries.forEach((entry) => {
    const index = all.findIndex(
      (item) => item.clientId === entry.clientId && item.normalizedStatus === entry.normalizedStatus
    );

    if (index >= 0) {
      all[index] = {
        ...all[index],
        rawStatus: entry.rawStatus,
        mappedCategory: entry.mappedCategory,
        source: entry.source,
        updatedAt: now,
      };
      return;
    }

    all.push(entry);
  });

  await writeAll(all);

  return getByClientId(clientId);
};

module.exports = {
  getByClientId,
  saveMappings,
};
