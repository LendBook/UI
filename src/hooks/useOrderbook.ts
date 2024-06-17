import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getOrderAddress } from "../utils/addressHelpers";
import OrderbookABI from "../config/abi/orderbook.json";

export const useOrderbook = () => {
  const { address } = useAccount();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (address) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);

      const orderbookAddress = getOrderAddress();
      const orderbookContract = new ethers.Contract(orderbookAddress, OrderbookABI, signer);
      setContract(orderbookContract);
    }
  }, [address]);

  return { contract, signer };
};
