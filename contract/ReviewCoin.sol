// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ReviewCoin is ERC20 {
    //배포 전 openzepplin decimals setting 필수;
    constructor(string memory _name, string memory _symbol, uint _initSupply) ERC20(_name, _symbol){
        _mint(msg.sender, _initSupply);
    }

    function approveByGSN(address _owner, address spender, uint256 amount) external returns (bool) {
        _approve(_owner, spender, amount);
        return true;
    }
}