// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("Web3 Agent Profile", "W3P") Ownable(msg.sender) {}

    function mintProfile(address to, string memory metadataURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        nextTokenId += 1;
    }

    function getMyProfile(address user) external view returns (uint256) {
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (ownerOf(i) == user) {
                return i;
            }
        }
        revert("Not found");
    }
}
