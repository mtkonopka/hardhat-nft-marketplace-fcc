const { ethers } = require("hardhat")
const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNFT")

    console.log("Mintung...")
    const tx = await basicNft.mintNFT()
    const rcp = await tx.wait(1)
    const tokenId = rcp.events[0].args.tokenId

    console.log("Approving...")
    const appTx = await basicNft.approve(nftMarketplace.address, tokenId)
    const appRcp = await tx.wait(1)

    console.log("Listing...")
    const lstTx = await nftMarketplace.listItem(basicNft.address, tokenId, 10)
    const lstRcp = await tx.wait(1)
    console.log("Listed!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
