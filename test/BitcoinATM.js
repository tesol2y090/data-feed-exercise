const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");

describe("BitcoinATM", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBitcoinATM() {
    const [deployer, alice, bob] = await ethers.getSigners()

    const DECIMALS = "18"
    const INITIAL_PRICE = ethers.utils.parseUnits("10000", 18)

    const mockTokenFactory = await ethers.getContractFactory("MockToken")
    const usdc = await mockTokenFactory.connect(deployer).deploy("USDC Token", "USDC")
    const wbtc = await mockTokenFactory.connect(deployer).deploy("Wrapped Bitcoin", "WBTC")


    const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator")
    const mockV3Aggregator = await mockV3AggregatorFactory
      .connect(deployer)
      .deploy(DECIMALS, INITIAL_PRICE)

    const bitcoinATMFactory = await ethers.getContractFactory("BitcoinATM")
    const bitcoinATM = await bitcoinATMFactory
      .connect(deployer)
      .deploy(mockV3Aggregator.address, usdc.address, wbtc.address)

    await usdc.connect(deployer).mint(bitcoinATM.address, ethers.utils.parseUnits("100000000", 18))
    await usdc.connect(deployer).mint(alice.address, ethers.utils.parseUnits("100000", 18))

    await usdc.connect(alice).approve(bitcoinATM.address, ethers.constants.MaxUint256)

    await wbtc.connect(deployer).mint(bitcoinATM.address, ethers.utils.parseUnits("100000000", 18))
    await wbtc.connect(deployer).mint(bob.address, ethers.utils.parseUnits("10", 18))

    await wbtc.connect(bob).approve(bitcoinATM.address, ethers.constants.MaxUint256)

    return { bitcoinATM, mockV3Aggregator, alice, bob, usdc, wbtc };
  }

  describe("Deployment", function () {
    describe("success", async function () {
      it("should set the aggregator addresses correctly", async () => {
        const { bitcoinATM, mockV3Aggregator } = await loadFixture(
          deployBitcoinATM
        )
        const response = await bitcoinATM.getPriceFeed()
        assert.equal(response, mockV3Aggregator.address)
      })
    })
  });

  describe("buyBitcoin", function () {
    it("should get 1 bitcoin when price btc/usd = 10,000", async () => {
      const { bitcoinATM, alice, usdc, wbtc } = await loadFixture(
        deployBitcoinATM
      )

      const buyAmount = ethers.utils.parseUnits("1", 18)

      await bitcoinATM.connect(alice).buyBitcoin(buyAmount)

      const wbtcAmount = await wbtc.balanceOf(alice.address)
      const usdcAmount = await usdc.balanceOf(alice.address)

      expect(wbtcAmount).to.eq(ethers.utils.parseUnits("1", 18))
      expect(usdcAmount).to.eq(ethers.utils.parseUnits("90000", 18))

    })

    it("should get 1 bitcoin when price btc/usd = 20,000", async () => {
      const { bitcoinATM, mockV3Aggregator, alice, usdc, wbtc } = await loadFixture(
        deployBitcoinATM
      )

      await mockV3Aggregator.updateAnswer(ethers.utils.parseUnits("20000", 18))

      const buyAmount = ethers.utils.parseUnits("1", 18)

      await bitcoinATM.connect(alice).buyBitcoin(buyAmount)

      const wbtcAmount = await wbtc.balanceOf(alice.address)
      const usdcAmount = await usdc.balanceOf(alice.address)

      expect(wbtcAmount).to.eq(ethers.utils.parseUnits("1", 18))
      expect(usdcAmount).to.eq(ethers.utils.parseUnits("80000", 18))

    })

  });

  describe("sellBitcoin", function () {
    it("should get 10,000 usdc when price btc/usd = 10,000", async () => {
      const { bitcoinATM, bob, usdc, wbtc } = await loadFixture(
        deployBitcoinATM
      )

      const sellAmount = ethers.utils.parseUnits("1", 18)

      await bitcoinATM.connect(bob).sellBitcoin(sellAmount)

      const wbtcAmount = await wbtc.balanceOf(bob.address)
      const usdcAmount = await usdc.balanceOf(bob.address)

      expect(wbtcAmount).to.eq(ethers.utils.parseUnits("9", 18))
      expect(usdcAmount).to.eq(ethers.utils.parseUnits("10000", 18))

    })

    it("should get 1 bitcoin when price btc/usd = 20,000", async () => {
      const { bitcoinATM, mockV3Aggregator, bob, usdc, wbtc } = await loadFixture(
        deployBitcoinATM
      )

      await mockV3Aggregator.updateAnswer(ethers.utils.parseUnits("20000", 18))

      const sellAmount = ethers.utils.parseUnits("1", 18)

      await bitcoinATM.connect(bob).sellBitcoin(sellAmount)

      const wbtcAmount = await wbtc.balanceOf(bob.address)
      const usdcAmount = await usdc.balanceOf(bob.address)

      expect(wbtcAmount).to.eq(ethers.utils.parseUnits("9", 18))
      expect(usdcAmount).to.eq(ethers.utils.parseUnits("20000", 18))

    })

  });

});
