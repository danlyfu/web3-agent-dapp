const cron = require("node-cron");
const { flushUsage } = require("../cache/usageCache");

cron.schedule("0 0 * * *", () => {
  console.log("🕛 Flushing usage to db/usage-log.json...");
  flushUsage();
});
