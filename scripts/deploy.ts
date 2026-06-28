import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CipherAlpha smart contract to Fhenix L2 Sepolia...");

  const CipherAlpha = await ethers.getContractFactory("CipherAlpha");
  const contract = await CipherAlpha.deploy();

  await contract.waitForDeployment();

  console.log(`CipherAlpha successfully deployed to: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
