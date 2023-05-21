const { run } = require("hardhat")

const verify = async (contractName, contractAddress, args) => {
    console.log("Verifying..")
    try {
        await run("verify:verify", {
            contract: `contracts/${contractName}.sol:${contractName}`,
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = { verify }
