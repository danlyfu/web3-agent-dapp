// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AgentToken is ERC20 {
    constructor() ERC20("AgentToken","AGT"){
        //initialized with 1 * 10^18 initial supply. (1000 AGT below)
        _mint(msg.sender,1000*10**18);
    }
}