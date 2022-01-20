async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.getDefaultProvider().getNetwork();
    const price_feed_address;
    const vrf_coordinator;

    if (network.name === "rinkeby") {
        price_feed_address = "0x9326BFA02ADD2366b30bacB125260Af641031331";
        vrf_coordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
    } else {
        // Deploy mocks
        const Mock = await ethers.getContractFactory("MockV3Aggregator");
        const mock = await Mock.deploy(8, 200000000000);
        await mock.deployed();
        price_feed_address = mock.address;
        console.log("Mock price feed address: " + price_feed_address);
    }
    
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(price_feed_address);
    await lottery.deployed();
  
    console.log("Lottery deployed to:", lottery.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });