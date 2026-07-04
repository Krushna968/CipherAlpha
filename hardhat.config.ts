import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@cofhe/hardhat-plugin";
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      blockGasLimit: 50000000
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 50000000
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
