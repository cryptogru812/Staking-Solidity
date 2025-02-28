import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-verify";

dotenv.config();

// const MAINNET_RPC_URL =
//   process.env.MAINNET_RPC_URL ||
//   'https://eth-mainnet.alchemyapi.io/v2/your-api-key';
// const POLYGON_MAINNET_RPC_URL =
//   process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-mainnet.alchemyapi.io/v2/your-api-key';
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
  
// const BSC_MAINNET_RPC_URL =
//   process.env.BSC_MAINNET_RPC_URL ||
//   'https://bsc-mainnet.alchemyapi.io/v2/your-api-key';
// const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL ||'';

// const BASE_TESTNET_RPC_URL = process.env.BASE_TESTNET_RPC_URL || '';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
// const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "Your bscscan API key";
// const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "Your bscscan API key";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL !== undefined ? SEPOLIA_RPC_URL : "",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    // mainnet: {
    //   url: MAINNET_RPC_URL,
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    //   chainId: 1,
    // },
    // bsc_mainnet: {
    //   url: process.env.BSC_MAINNET_RPC_URL,
    //   chainId: 56,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // bsc_testnet: {
    //   url: BSC_TESTNET_RPC_URL,
    //   chainId: 97,
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    // },
    // base_testnet: {
    //   url: BASE_TESTNET_RPC_URL,
    //   chainId: 84532,
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    // },
    
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
    //   // npx hardhat verify --list-networks
      sepolia: ETHERSCAN_API_KEY,
      // mainnet: ETHERSCAN_API_KEY,
      // bsc_testnet: BSCSCAN_API_KEY,
      // base_testnet: BASESCAN_API_KEY,
      // polygon: POLYGONSCAN_API_KEY,
    },
    // apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    // currency: 'USD',
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};

export default config;
