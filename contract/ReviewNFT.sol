//SPDX-License-Identifier: MIT;

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ReviewNFT is ERC721URIStorage {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function minting(address _owner, string memory _tokenURI, uint TotalSupply) external {
        //NFT Token;
        _safeMint(_owner, TotalSupply);
        _setTokenURI(TotalSupply, _tokenURI);
    }

    function approveForAll(address _owner, address _contractAddress) public {
        _setApprovalForAll(_owner, _contractAddress, true);
    }
}