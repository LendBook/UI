import { useState } from 'react';
import { ethers } from 'ethers';

export const useEthersSigner = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connect = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      setAccount(await signer.getAddress());
    }
  };

  return { account, connect };
};
