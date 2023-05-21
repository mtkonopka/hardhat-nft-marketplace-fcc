const { ethers, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const SUBSCRIPTION_FUND_AMT = ethers.utils.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(`chainId: ${chainId}`)

    // let VRFAddress, subscriptionId
    // if (developmentChains.includes(network.name)) {
    //     const vrfMock = await ethers.getContract("VRFCoordinatorV2Mock")
    //     VRFAddress = vrfMock.address
    //     const txRes = await vrfMock.createSubscription()
    //     const txRcp = await txRes.wait(1)
    //     subscriptionId = txRcp.events[0].args.subId
    //     await vrfMock.fundSubscription(subscriptionId, SUBSCRIPTION_FUND_AMT)
    // } else {
    //     VRFAddress = networkConfig[chainId]["VRFCoordinatorV2Address"]
    //     subscriptionId = networkConfig[chainId]["subscriptionId"]
    // }

    // const entranceFee = networkConfig[chainId]["entranceFee"]
    // const gassLane = networkConfig[chainId]["gassLane"]
    // const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"]
    // const interval = networkConfig[chainId]["interval"]

    // const deployArguments = [VRFAddress, gassLane, subscriptionId, callBackGasLimit, interval, entranceFee]
    const deployArguments = []
    const basicNFT = await deploy("BasicNFT", {
        contract: "BasicNFT",
        from: deployer,
        args: deployArguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // if (developmentChains.includes(network.name)) {
    //     // Ensure the Raffle contract is a valid consumer of the VRFCoordinatorV2Mock contract.
    //     const vrfMock = await ethers.getContract("VRFCoordinatorV2Mock")
    //     await vrfMock.addConsumer(subscriptionId, raffle.address)
    // }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify("BasicNFT", basicNFT.address, deployArguments)
    }
    log("02---------------------")
}
module.exports.tags = ["all", "basic"]
