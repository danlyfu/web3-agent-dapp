const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1️.加载部署信息
  const { agentToken, whitelistContract } = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "deployed.json"))
  );

  const [owner, user] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("AgentToken");
  const token = Token.attach(agentToken);

  const Whitelist = await hre.ethers.getContractFactory("WhitelistContract");
  const whitelist = Whitelist.attach(whitelistContract);

  // 2️.发 100 AGT 给用户
  const amount = hre.ethers.utils.parseUnits("100", 18);
  const ownerBalance = await token.balanceOf(owner.address);
  console.log("Owner AGT balance:", ownerBalance.toString());

  await token.transfer(user.address, amount);
  console.log("Transferred 100 AGT to user");

  // 3️.用户 approve whitelist 合约
  await token.connect(user).approve(whitelist.address, amount);
  console.log("User approved whitelist to spend AGT");

  // 4️.设置 admin 和 flexRate（1 次访问 = 10 AGT）
  await whitelist.setAdmin(owner.address);
  await whitelist.setFlexRate(hre.ethers.utils.parseUnits("10", 18));
  console.log("Admin set and flex rate set");

  // 5️.用户 topUp
  await whitelist.connect(user).topUp(amount);
  console.log("User topped up access");

  // 6️.查询 accessBalance
  const access = await whitelist.accessBalance(user.address);
  console.log(`User has ${access.toString()} access count`);
}

main().catch((err) => {
  console.error("Error in test script:", err);
  process.exitCode = 1;
});
