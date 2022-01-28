const { expect } = require("chai");
const { ethers } = require("hardhat");
const assert = require('assert');

let secrets = require("../secrets.json");
const abi = require("../LinkTokenABI.json");

async function main() {
    const signer = new ethers.Wallet(secrets.rinkebySecretKey, ethers.provider);

    const price_feed_address = "0x9326BFA02ADD2366b30bacB125260Af641031331";
    const vrf_coordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
    const link_token = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    const keyhash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
    const fee = 1000000000000000;
    
    this.Lottery = await ethers.getContractFactory("Lottery");
    this.lottery = await this.Lottery.deploy(price_feed_address, vrf_coordinator, link_token, fee, keyhash);
    await this.lottery.deployed();

    console.log("Lottery deployed to:", this.lottery.address);

    await this.lottery.startLottery();
    await this.lottery.enter(overrides = {value: ethers.utils.parseUnits("2", 17)});

    const LinkToken = new ethers.Contract(link_token, abi, signer);
    await LinkToken.transfer(this.lottery.address, 1000000000000000);

    await this.lottery.endLottery();
    const lotteryWinner = await this.lottery.latestWinner();
    const userAddress = await signer.getAddress();
    await assert.equal(lotteryWinner, userAddress);
    const balance = await ethers.provider.getBalance(this.lottery.address);
    assert.equal(balance, 0);
}

    main()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
        });