// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

/**
 * @title The Bitcoin ATM contract
 * This contract represent a bitcoin ATM.
 * User can buy and sell bitcoin.
 */
contract BitcoinATM {
    AggregatorV3Interface internal immutable priceFeed;
    IERC20 public usdc;
    IERC20 public wbtc;

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     * @param _priceFeed - Price Feed Address
     * @param _usdc - UDSC Token Address
     * @param _wbtc - WBTC Token Address
     */
    // TODO: 1.Create constructor that receive 3 argument.
    constructor() {
        /// code here
    }


    /**
     * @notice Buy bitcoin by taking usdc and return bitcoin
     *
     * @param _amount - Amount of bitcoin to buy
     */
    // TODO: 2.Create buy bitcoin function that take amount of bitcoin to buy.
	function buyBitcoin(uint256 _amount) external {
        /// code here
	}

    /**
     * @notice Sell bitcoin by taking bitcoin and return usdc
     *
     * @param _amount - Amount of bitcoin to buy
     */
    // TODO: 3.Create sell bitcoin function that take amount of bitcoin to sell.
	function sellBitcoin(uint256 _amount) external {
        /// code here
	}

    /**
     * @notice Returns the latest price
     *
     * @return latest price
     */
    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @notice Returns the Price Feed address
     *
     * @return Price Feed address
     */
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
