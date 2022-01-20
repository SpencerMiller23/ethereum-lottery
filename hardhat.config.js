require("@nomiclabs/hardhat-ethers")
let secrets = require("./secrets")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
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
