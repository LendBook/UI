import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getUsdcAddress } from "../utils/addressHelpers";
import QuoteTokenABI from "../config/abi/usdc.json";

export const useQuoteToken = () => {
  const { address } = useAccount();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (address) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);

      const quoteTokenAddress = getUsdcAddress();
      const quoteTokenContract = new ethers.Contract(
        quoteTokenAddress,
        QuoteTokenABI,
        signer
      );
      setContract(quoteTokenContract);
    }
  }, [address]);

  return { contract, signer };
};
