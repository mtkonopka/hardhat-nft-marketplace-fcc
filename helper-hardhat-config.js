const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: "sepolia",
        gasPrice: 50000000000,
        VRFCoordinatorV2Address: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        subscriptionId: "805",
        gassLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        entranceFee: ethers.utils.parseEther("0.05"),
        mintFee: ethers.utils.parseEther("0.01"),
        callBackGasLimit: "500000",
        interval: "30", //seconds
        deployedContractAddress: "0xbF79a1Dbc5a33FF31fCdb2d9A761cB453b066641",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        gasPrice: 35000000000,
    },
    5: {
        name: "goerli",
        gasPrice: 50000000000,
        VRFCoordinatorV2Address: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gassLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        entranceFee: ethers.utils.parseEther("0.05"),
        mintFee: ethers.utils.parseEther("0.01"),
        callBackGasLimit: "500000",
        interval: "30", //seconds
        ethUSDPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        gasPrice: 35000000000,
    },
    1337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        gassLane: "0x99999999999958807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823b9999", // dummy
        callBackGasLimit: "500000",
        interval: "30", //seconds
        mintFee: ethers.utils.parseEther("0.01"),
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // dummy
        gasPrice: 35000000000,
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 0
const INITIAL_ANSWER = 200000000000
const BASE_FEE = "100000000000000000" // 0.25 LINK
const GAS_PRICE_PER_LINK = 1e9

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    BASE_FEE,
    GAS_PRICE_PER_LINK,
    GAS_PRICE_PER_LINK,
}
