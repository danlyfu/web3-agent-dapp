const usageMap = new Map();

function getTodayKey(address) {
  const date = new Date().toISOString().slice(0, 10); // e.g. 2025-05-07
  return `${address}_${date}`;
}

function incrementUsage(address) {
  const key = getTodayKey(address);
  const current = usageMap.get(key) || 0;
  usageMap.set(key, current + 1);
}

function getUsage(address) {
  const key = getTodayKey(address);
  return usageMap.get(key) || 0;
}

function flushUsage() {
  const output = {};
  for (const [key, count] of usageMap.entries()) {
    output[key] = count;
  }
  require("fs").writeFileSync("db/usage-log.json", JSON.stringify(output, null, 2));
}

module.exports = { incrementUsage, getUsage, flushUsage };
