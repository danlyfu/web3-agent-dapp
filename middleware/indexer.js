const fs = require("fs");
const path = require("path");
const { whitelist } = require("./contract");

// 本地 NoSQL 文件路径
const DB_FILE = path.join(__dirname, "db.json");

// 工具函数：读取本地缓存
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

// 工具函数：写入本地缓存
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = readDB();

if (!whitelist) {
  console.error("Whitelist contract not loaded.");
  process.exit(1);
}

// 监听 AccessUpdated 事件
whitelist.on("AccessUpdated", (user, newBalance) => {
  console.log(`AccessUpdated: ${user} => ${newBalance.toString()}`);

  db[user.toLowerCase()] = newBalance.toString(); // 小写统一地址
  writeDB(db);
});

// 启动信息
console.log("Indexer is running and listening for AccessUpdated...");
