const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [owner] = await ethers.getSigners();

  const TARGET_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const AGT_AMOUNT = "1";
  const TOKEN_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const WHITELIST_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  const AgentToken = await ethers.getContractFactory("AgentToken");
  const Whitelist = await ethers.getContractFactory("WhitelistContract");

  const token = await AgentToken.attach(TOKEN_ADDRESS);
  const whitelist = await Whitelist.attach(WHITELIST_ADDRESS);

  const amount = ethers.utils.parseUnits(AGT_AMOUNT, 18);

  console.log(`Transferring ${AGT_AMOUNT} AGT to ${TARGET_ADDRESS}`);
  const tx1 = await token.transfer(TARGET_ADDRESS, amount);
  await tx1.wait();

  console.log("Transfer complete");

  console.log(`Approving whitelist contract to spend ${AGT_AMOUNT} AGT`);
  const userSigner = await ethers.getSigner(TARGET_ADDRESS);
  const tokenAsUser = token.connect(userSigner);
  const tx2 = await tokenAsUser.approve(WHITELIST_ADDRESS, amount);
  await tx2.wait();

  console.log("Approval complete");

  console.log("Calling topUp()...");
  const whitelistAsUser = whitelist.connect(userSigner);
  const tx3 = await whitelistAsUser.topUp(amount);
  await tx3.wait();

  console.log("TopUp complete");

  const access = await whitelist.accessBalance(TARGET_ADDRESS);
  console.log(`New access balance: ${access.toString()} times`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
