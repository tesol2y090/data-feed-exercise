// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockToken is ERC20, Ownable {
  constructor(string memory _name, string memory _symbol) public ERC20(_name, _symbol) {}

  function mint(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
  }

  receive() external payable {
    _mint(msg.sender, msg.value);
  }
}
