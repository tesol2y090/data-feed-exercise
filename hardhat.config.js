require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const COMPILER_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1000000,
  },
  metadata: {
    bytecodeHash: "none",
  },
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        COMPILER_SETTINGS,
      },
      {
        version: "0.6.6",
        COMPILER_SETTINGS,
      },
      {
        version: "0.4.24",
        COMPILER_SETTINGS,
      },
    ],
  },
};
