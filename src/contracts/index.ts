
import { ethers } from "ethers";

// import Contrats from "./contracts/4002.json";
import Contrats from "./contracts/4002.json";
import { fromBigNum } from "../utils";
const supportChainId = 4002;
const TOTALPRESALETOKENAMOUNT = 400000000;

const RPCS = {
    1: "https://mainnet.infura.io/v3/7e2f78ddbf394bc9ab92ebb175b60a64",
    56: "https://bsc-dataseed.binance.org/",
    97: "https://bsc-testnet.publicnode.com",
    4002: "https://fantom-testnet.publicnode.com",
}

const providers = {
    1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    56: new ethers.providers.JsonRpcProvider(RPCS[56]),
    97: new ethers.providers.JsonRpcProvider(RPCS[97]),
    4002: new ethers.providers.JsonRpcProvider(RPCS[4002])
}

const presaleContract = new ethers.Contract(Contrats.presale.address, Contrats.presale.abi, providers[supportChainId]);
const usdtContract = new ethers.Contract(Contrats.usdt, Contrats.token.abi, providers[supportChainId]);
const getProgress = async () => {
    const balance = await presaleContract.totalSaled();
    const tokenEthBalance = fromBigNum(balance, 18);
    console.log("current balance", tokenEthBalance);
    return [(tokenEthBalance / TOTALPRESALETOKENAMOUNT) * 100,tokenEthBalance];
}

export {
    providers, presaleContract, usdtContract, getProgress
}