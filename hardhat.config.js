require("@nomiclabs/hardhat-ethers")
const { task } = require("hardhat/config");
let secrets = require("./secrets")

task("startLottery", "Starts the lottery")
  .addPositionalParam("address", "The address of the lottery contract")
  .setAction(async (args) => {
    const { address } = args;
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.attach(address);
    await lottery.startLottery();
    console.log("Lottery started");
  })

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
