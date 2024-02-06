
import {ethers, providers} from "ethers";
import Contrats from "./contracts/168587773.json";
import { fromBigNum } from "../utils";
import {WalletClient, useWalletClient } from "wagmi";
import { useMemo } from "react";
const supportChainId = 168587773;

const RPCS = {
    1: "https://mainnet.infura.io/v3/7e2f78ddbf394bc9ab92ebb175b60a64",
   // 56: "https://bsc-dataseed.binance.org/",
   // 97: "https://bsc-testnet.publicnode.com",
    4002: "https://fantom-testnet.publicnode.com",
    168587773: "https://sepolia.blast.io",
}

const providersRPC = {
    1: new ethers.providers.JsonRpcProvider(RPCS[1]),
  //  56: new ethers.providers.JsonRpcProvider(RPCS[56]),
  //  97: new ethers.providers.JsonRpcProvider(RPCS[97]),
    4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    168587773: new ethers.providers.JsonRpcProvider(RPCS[168587773])
}

export function walletClientToSigner(walletClient: WalletClient) {
    const {account, chain, transport} = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
}

export function useEthersSigner({chainId}: { chainId?: number } = {}) {
    const {data: walletClient} = useWalletClient({chainId});
    return useMemo(
        () => (walletClient ? walletClientToSigner(walletClient) : undefined),
        [walletClient]
    );
}

const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, providersRPC[supportChainId]);
const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, providersRPC[supportChainId]);
const orderbookContract = new ethers.Contract(Contrats.orderbook.address, Contrats.orderbook.abi, providersRPC[supportChainId]);

const getEthPrice = async () => {
    try {
        const price = await orderbookContract.priceFeed();
        console.log("price : " + price);
        return fromBigNum(price, 18);

    } catch (error) {
        console.error('Erreur lors de la récupération du prix ETH:', error);
        return null;
    }
};

const getUSDCPrice = async () => {
    try {
       // const price = await usdcPriceFeedContract.latestRoundData();
        return 1; 
        
    } catch (error) {
        console.error('Erreur lors de la récupération du prix USDC:', error);
        return null;
    }
};

const getContractWrapper = (contract: ethers.Contract) => {
    return {
        connect: (signer: ethers.Signer) => {
            return contract.connect(signer);
        },
        mint: async (to: string, amount: ethers.BigNumber) => {
            const tx = await contract.mint(to, amount);
            return tx;
        }
    } as {
        connect: (signer: ethers.Signer) => any;
        mint: (to: string, amount: ethers.BigNumber) => Promise<any>;
    };
};


export const usdcContractWrapper = getContractWrapper(usdcContract);
export const wethContractWrapper = getContractWrapper(wethContract);

export {providers, usdcContract, orderbookContract, getEthPrice, getUSDCPrice, wethContract};