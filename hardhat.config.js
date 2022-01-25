require("@nomiclabs/hardhat-ethers")
let secrets = require("./secrets")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.11",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.8.0",
      }
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: secrets.alchemyMainnetUrl,
      }
    },
    rinkeby: {
      url: secrets.alchemyRinkebyUrl,
      accounts: [secrets.rinkebySecretKey]
    }
  }
};
