
import { ethers } from "ethers";

import Contrats from "./contracts/97.json";
import { fromBigNum } from "../utils";
const supportChainId = 97;

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


const ethPriceFeedContract = new ethers.Contract(Contrats.ethPriceFeed.address, Contrats.ethPriceFeed.abi, providers[supportChainId]);

const usdcPriceFeedContract = new ethers.Contract(Contrats.usdcPriceFeed.address, Contrats.usdcPriceFeed.abi, providers[supportChainId]);

const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.token.abi, providers[supportChainId]);

const wethContract = new ethers.Contract(Contrats.usdc.address, Contrats.token.abi, providers[supportChainId]);

const orderbookContract = new ethers.Contract(Contrats.orderbook.address, Contrats.orderbook.abi, providers[supportChainId]);

const getEthPrice = async () => {
    try {
        const price = await ethPriceFeedContract.latestRoundData();
        return fromBigNum(price.answer, 8);
    } catch (error) {
        console.error('Erreur lors de la récupération du prix ETH:', error);
        return null;
    }
};

const getUSDCPrice = async () => {
    try {
        const price = await usdcPriceFeedContract.latestRoundData();
        return fromBigNum(price.answer, 8); // Assurez-vous que le nombre de décimales est correct pour le flux de données USDC
    } catch (error) {
        console.error('Erreur lors de la récupération du prix USDC:', error);
        return null;
    }
};

export {
    providers, usdcContract, orderbookContract, getEthPrice, getUSDCPrice
}