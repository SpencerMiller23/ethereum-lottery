const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery unit test", function() {
    before(async function() {
        this.deployer = await ethers.getSigners();
        let price_feed_address;
        let vrf_coordinator;
        let link_token;
        const keyhash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
        const fee = 1000000000000000;

        // Deploy mocks
        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        const mockAggregator = await MockV3Aggregator.deploy(8, 200000000000);
        await mockAggregator.deployed();
        price_feed_address = mockAggregator.address;
        console.log("Mock price feed address: " + price_feed_address);

        const MockLinkToken = await ethers.getContractFactory("LinkToken");
        this.mockLinkToken = await MockLinkToken.deploy();
        await this.mockLinkToken.deployed();
        link_token = this.mockLinkToken.address;
        console.log("Mock link token address: " + link_token);

        const MockVRFCoordinator = await ethers.getContractFactory("MockVRFCoordinator");
        this.mockVRFCoordinator = await MockVRFCoordinator.deploy(link_token);
        await this.mockVRFCoordinator.deployed();
        vrf_coordinator = this.mockVRFCoordinator.address;
        console.log("Mock vrf coordinator address: " + vrf_coordinator);
        
        this.Lottery = await ethers.getContractFactory("Lottery");
        this.lottery = await this.Lottery.deploy(price_feed_address, vrf_coordinator, link_token, fee, keyhash);
        await this.lottery.deployed();
    
        console.log("Lottery deployed to:", this.lottery.address);
    });

    it("Test if entrance fee is calculated properly", async function() {
        this.entranceFee = parseInt(await this.lottery.getEntranceFee());
        // $2,000 USD/ETH
        // USD entrance fee: $50
        // ETH entrance fee: 0.025 ETH
        const expectedEntranceFee = parseInt(ethers.utils.parseEther("0.025"));
        expect(this.entranceFee).to.equal(expectedEntranceFee);
    });

    it("Test if users can enter a lottery that is not open", async function() {
        await expect(this.lottery.enter(overrides = {value: 250000000000000})).to.be.revertedWith("Lottery is not open");
    });

    it("Test if users can enter a lottery that is open", async function() {
        this.accounts = await hre.ethers.getSigners();
        await this.lottery.startLottery();
        await this.lottery.connect(this.accounts[0]).enter(overrides = {value: ethers.utils.parseUnits("5", 16)});
        await this.lottery.connect(this.accounts[1]).enter(overrides = {value: ethers.utils.parseUnits("5", 16)});
        await this.lottery.connect(this.accounts[2]).enter(overrides = {value: ethers.utils.parseUnits("5", 16)});
        await expect(this.lottery.players[0]).to.equal(this.deployer.address);
    });

    it("Test if the winner is chosen correctly", async function() {
        await this.mockLinkToken.transfer(this.lottery.address, 1000000000000000);
        const tx = await this.lottery.endLottery();
        const lotteryState = await this.lottery.lotteryState();
        await expect(lotteryState).to.equal(2);

        const receipt = await tx.wait();
        const requestId = receipt.events[0].topics[1];
        const STATIC_RNG = 345;
        this.mockVRFCoordinator.callBackWithRandomness(requestId, STATIC_RNG, this.lottery.address);
        // 345 % 3 = 0
        const lotteryWinner = await this.lottery.latestWinner();
        await expect(lotteryWinner).to.equal(this.accounts[0].address);
        const balance = await ethers.provider.getBalance(this.lottery.address);
        await expect(balance).to.equal(0);
    });
});