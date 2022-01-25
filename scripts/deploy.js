async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.getDefaultProvider().getNetwork();
    let price_feed_address;
    let vrf_coordinator;
    let link_token;
    const keyhash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
    const fee = 1000000000000000;

    if (network.name === "rinkeby") {
        price_feed_address = "0x9326BFA02ADD2366b30bacB125260Af641031331";
        vrf_coordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
        link_token = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    } else {
        // Deploy mocks
        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        const mockAggregator = await MockV3Aggregator.deploy(8, 200000000000);
        await mockAggregator.deployed();
        price_feed_address = mockAggregator.address;
        console.log("Mock price feed address: " + price_feed_address);

        const MockLinkToken = await ethers.getContractFactory("LinkToken");
        const mockLinkToken = await MockLinkToken.deploy();
        await mockLinkToken.deployed();
        link_token = mockLinkToken.address;
        console.log("Mock link token address: " + link_token);

        const MockVRFCoordinator = await ethers.getContractFactory("MockVRFCoordinator");
        const mockVRFCoordinator = await MockVRFCoordinator.deploy(link_token);
        await mockVRFCoordinator.deployed();
        vrf_coordinator = mockVRFCoordinator.address;
        console.log("Mock vrf coordinator address: " + vrf_coordinator);
    }
    
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(price_feed_address, vrf_coordinator, link_token, fee, keyhash);
    await lottery.deployed();
  
    console.log("Lottery deployed to:", lottery.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });