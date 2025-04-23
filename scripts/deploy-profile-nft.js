const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const ProfileNFT = await hre.ethers.getContractFactory("ProfileNFT");
  const profileNFT = await ProfileNFT.deploy();
  await profileNFT.deployed();

  console.log("ProfileNFT deployed at:", profileNFT.address);

  // 保存地址到 deployed.json
  const deployed = fs.existsSync("deployed.json")
    ? JSON.parse(fs.readFileSync("deployed.json"))
    : {};
  deployed.profileNFT = profileNFT.address;
  fs.writeFileSync("deployed.json", JSON.stringify(deployed, null, 2));
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
