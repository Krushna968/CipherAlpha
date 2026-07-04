import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@cofhe/hardhat-plugin";
import * as dotenv from "dotenv";
dotenv.config({ path: './backend/.env' });

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      blockGasLimit: 50000000
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 50000000
    },
    sepolia: {
      url: process.env.FHE_SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
