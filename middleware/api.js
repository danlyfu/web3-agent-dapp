const express = require("express");
const { whitelist } = require("./contract");
const { readJSON, writeJSON } = require("./utils");
const { verifySignature } = require("./utils/verifySignature");
const { incrementUsage, getUsage } = require("./cache/usageCache");
const { addMessage, getChatHistory } = require("./cache/chatCache");
require("./jobs/cron"); // 启动定时任务

const app = express();
app.use(express.json());

const CACHE_FILE = "db.json";
const DAILY_LIMIT = 5;

app.post("/chat", async (req, res) => {
  const { user, message, signature } = req.body;

  if (!user || !message || !signature) {
    return res.status(400).json({ error: "Missing user, message or signature" });
  }

  //  验证签名是否正确（防止伪造请求）
  const isValid = verifySignature(user, message, signature);
  if (!isValid) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  //  从缓存中检查今日使用次数
  const usage = getUsage(user);
  if (usage >= DAILY_LIMIT) {
    return res.status(403).json({ error: "Daily usage limit exceeded" });
  }

  //  从缓存或合约检查 accessBalance
  const cache = readJSON(CACHE_FILE);
  let access = cache[user.toLowerCase()];
  if (!access) {
    access = await whitelist.accessBalance(user);
    access = access.toString();
  }

  if (parseInt(access) <= 0) {
    return res.status(403).json({ error: "Insufficient access" });
  }

  // 缓存对话历史（仅保留 20 条）
  addMessage(user, { role: "user", content: message });
  const reply = "This is a simulated AI response.";
  addMessage(user, { role: "ai", content: reply });

  // 记录使用次数
  incrementUsage(user);

  res.json({
    reply,
    remaining: parseInt(access) - 1,
    todayUsed: usage + 1,
    history: getChatHistory(user)
  });
});

app.listen(3000, () => {
  console.log(" API Server running at http://localhost:3000");
});
