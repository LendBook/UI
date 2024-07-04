import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getWethAddress } from "../utils/addressHelpers";
import BaseTokenABI from "../config/abi/weth.json";

export const useBaseToken = () => {
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

      const baseTokenAddress = getWethAddress();
      const baseTokenContract = new ethers.Contract(
        baseTokenAddress,
        BaseTokenABI,
        signer
      );
      setContract(baseTokenContract);
    }
  }, [address]);

  return { contract, signer };
};
