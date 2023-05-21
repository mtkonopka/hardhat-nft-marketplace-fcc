// SPX-License-Identifier: MIT

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
error NftMarketplace__PriceBelowZero();
error NftMarketplace__MarketplaceNotApproved();
error NftMarketplace__AlredyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__SenderNotOwner(address nftAddress, uint256 tokenId, address sender);
error NftMarketplace__NotEnoughETH(uint256 value, uint256 price);
error NftMarketplace__NoProceedsToWithdraw();
error NftMarketplace__TransferFailed();

contract NftMarketplace is ReentrancyGuard {
    event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ItemBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address seller,
        address indexed buyer,
        uint256 price
    );
    event ItemCancelled(address indexed nftAddress, uint256 indexed tokenId);

    struct Listing {
        uint256 price;
        address seller;
    }

    // NFT parent contract address => (tokenId => (price, seller))
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_sellerToProceeds;

    modifier notListed(address nftAddress, uint256 tokenId) {
        if (s_listings[nftAddress][tokenId].price > 0) {
            revert NftMarketplace__AlredyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        if (s_listings[nftAddress][tokenId].price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId) {
        if (msg.sender != IERC721(nftAddress).ownerOf(tokenId)) {
            revert NftMarketplace__SenderNotOwner(nftAddress, tokenId, msg.sender);
        }
        _;
    }

    // constructor() {}

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAddress, tokenId) isOwner(nftAddress, tokenId) {
        if (price <= 0) {
            revert NftMarketplace__PriceBelowZero();
        }

        // if the marketplace is not currently set as approved...
        if (IERC721(nftAddress).getApproved(tokenId) != address(this)) {
            revert NftMarketplace__MarketplaceNotApproved();
        }

        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId) nonReentrant {
        if (msg.value < s_listings[nftAddress][tokenId].price) {
            revert NftMarketplace__NotEnoughETH(msg.value, s_listings[nftAddress][tokenId].price);
        }
        address seller = IERC721(nftAddress).ownerOf(tokenId);
        s_sellerToProceeds[seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);

        IERC721(nftAddress).safeTransferFrom(seller, msg.sender, tokenId);
        emit ItemBought(nftAddress, tokenId, seller, msg.sender, msg.value);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external isOwner(nftAddress, tokenId) isListed(nftAddress, tokenId) {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCancelled(nftAddress, tokenId);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isOwner(nftAddress, tokenId) isListed(nftAddress, tokenId) {
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdraw() external nonReentrant {
        uint256 senderProceeds = s_sellerToProceeds[msg.sender];
        if (senderProceeds <= 0) revert NftMarketplace__NoProceedsToWithdraw();

        s_sellerToProceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: senderProceeds}("");
        if (!success) revert NftMarketplace__TransferFailed();
    }

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view isOwner(nftAddress, tokenId) isListed(nftAddress, tokenId) returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds() external view returns (uint256) {
        return s_sellerToProceeds[msg.sender];
    }
}
