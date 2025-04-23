const express = require("express");
const { whitelist } = require("./contract");
const { readJSON, writeJSON } = require("./utils");
const app = express();

const CACHE_FILE = "db.json";
const CHAT_FILE = "chatHistory.json";

app.use(express.json());

// 模拟 AI 聊天服务
app.post("/chat", async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) return res.status(400).send("Missing user or message");

  // 尝试从缓存中获取 access count
  const cache = readJSON(CACHE_FILE);
  let access = cache[user.toLowerCase()];

  if (!access) {
    // fallback：从链上查询
    access = await whitelist.accessBalance(user);
    access = access.toString();
  }

  if (parseInt(access) <= 0) {
    return res.status(403).json({ error: "Insufficient access" });
  }

  // 保存对话历史
  const chatDB = readJSON(CHAT_FILE);
  chatDB[user] = chatDB[user] || [];
  chatDB[user].push({ role: "user", content: message });
  chatDB[user].push({ role: "ai", content: "This is a simulated AI response." });
  writeJSON(CHAT_FILE, chatDB);

  // 返回模拟 AI 回复
  res.json({
    reply: "This is a simulated AI response.",
    remaining: parseInt(access) - 1
  });
});

app.listen(3000, () => console.log("API Server running at http://localhost:3000"));
