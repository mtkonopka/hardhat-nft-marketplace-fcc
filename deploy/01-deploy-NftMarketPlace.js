const { ethers, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const SUBSCRIPTION_FUND_AMT = ethers.utils.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(`chainId: ${chainId}`)

    const deployArguments = []
    const basicNFT = await deploy("NftMarketplace", {
        contract: "NftMarketplace",
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify("NftMarketplace", basicNFT.address, [])
    }
    log("01---------------------")
}
module.exports.tags = ["all", "marketplace"]
