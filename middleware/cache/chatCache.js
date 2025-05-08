const chatMap = new Map();
const LIMIT = 20;

function addMessage(address, message) {
  const msgs = chatMap.get(address) || [];
  msgs.push(message);
  if (msgs.length > LIMIT) msgs.shift(); // 保留最新20条
  chatMap.set(address, msgs);
}

function getChatHistory(address) {
  return chatMap.get(address) || [];
}

module.exports = { addMessage, getChatHistory };
