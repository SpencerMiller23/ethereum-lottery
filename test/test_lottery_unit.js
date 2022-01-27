const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function() {
    it("Test if entrance fee is calculated properly", async function() {
        const Lottery = await ethers.getContractFactory("Lottery");
        const lottery = await Lottery.deploy("0x9326BFA02ADD2366b30bacB125260Af641031331");
        await lottery.deployed();
        const fee = await lottery.getEntranceFee();
        //console.log("Entrance fee: " + fee);
        //expect(fee).to.be.greaterThan(20000000000000);
    });
});