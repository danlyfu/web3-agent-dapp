const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const Token = await hre.ethers.getContractFactory("AgentToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("AgentToken deployed at:", token.address);

  const Whitelist = await hre.ethers.getContractFactory("WhitelistContract");
  const whitelist = await Whitelist.deploy(token.address);
  await whitelist.deployed();
  console.log("WhitelistContract deployed at:", whitelist.address);

  // 保存合约地址到 deployed.json
  const deployedInfo = {
    agentToken: token.address,
    whitelistContract: whitelist.address,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };

  const filepath = path.join(__dirname, "..", "deployed.json");
  fs.writeFileSync(filepath, JSON.stringify(deployedInfo, null, 2));
  console.log("Contract addresses saved to deployed.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
