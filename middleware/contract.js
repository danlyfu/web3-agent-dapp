require("dotenv").config();
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

// 确保 ABI 路径正确（相对 middleware 目录）
const abiPath = path.resolve(__dirname, "../artifacts/contracts/WhitelistContract.sol/WhitelistContract.json");

if (!fs.existsSync(abiPath)) {
  console.error("❌ ABI file not found at:", abiPath);
  process.exit(1);
}

const whitelistAbi = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

let whitelist;
try {
  whitelist = new ethers.Contract(
    process.env.WHITELIST_CONTRACT,
    whitelistAbi,
    signer
  );
  console.log("Whitelist contract loaded:", whitelist.address);
} catch (err) {
  console.error("Failed to load whitelist contract:", err.message);
}

module.exports = { whitelist, provider };
