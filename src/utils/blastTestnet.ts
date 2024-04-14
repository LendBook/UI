import { type Chain } from "viem";

export const blast: Chain = {
  id: 168587773,
  name: "Blast Network",
  network: "blast",
  nativeCurrency: { name: "Blast", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.blast.io"] },
    public: { http: ["https://sepolia.blast.io"] },
  },
  blockExplorers: {
    default: { name: "Blast Explorer", url: "https://testnet.blastscan.io/" },
  },
  contracts: {},
};

export const blastChain = blast;
