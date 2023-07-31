// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Token {
    string public name = "Hardhat Token";
    string public symbol = "HHT";
    uint public totalsupply = 10000;

    address public owner;

    mapping(address => uint)balances;

    constructor(){
      balances[msg.sender] = totalsupply;
      owner = msg.sender;
    }

    function transfer(address to,uint amount)external{
        require(balances[msg.sender]>= amount,"not enough tokens");
        balances[msg.sender]-= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint) {
      return balances[account];
    }
    

}