// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WhitelistContract is Ownable {
    /// -------------------------------
    /// 权限相关
    /// -------------------------------

    address public admin;
    uint256 public flexRate; // 每次服务访问所需 Token 数量
    IERC20 public token;

    mapping(address => uint256) public accessBalance;

    event AccessUpdated(address indexed user, uint256 newBalance);

    /// -------------------------------
    /// 构造函数（传入 Token 地址 + 设置 owner）
    /// -------------------------------

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
        admin = msg.sender;
    }

    /// -------------------------------
    /// 权限设置
    /// -------------------------------

    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
    }

    function setFlexRate(uint256 _rate) external onlyAdmin {
        flexRate = _rate;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin || msg.sender == owner(), "Not admin");
        _;
    }

    /// -------------------------------
    /// 用户充值 token（购买访问次数）
    /// -------------------------------

    function topUp(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        // 从用户钱包转 Token 到合约
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // 计算获得的访问次数
        require(flexRate > 0, "Flex rate not set");
        uint256 credits = amount / flexRate;
        require(credits > 0, "Insufficient amount for one access");

        accessBalance[msg.sender] += credits;

        emit AccessUpdated(msg.sender, accessBalance[msg.sender]);
    }

    /// -------------------------------
    /// 用户消费访问次数
    /// -------------------------------

    function useAccess() external {
        require(accessBalance[msg.sender] > 0, "No access left");

        accessBalance[msg.sender] -= 1;
        emit AccessUpdated(msg.sender, accessBalance[msg.sender]);
    }

    /// -------------------------------
    /// 查询访问余额
    /// -------------------------------

    function hasAccess(address user) external view returns (bool) {
        return accessBalance[user] > 0;
    }
}
