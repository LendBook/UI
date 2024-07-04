import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useBaseToken } from "./useBaseToken";
import { useAccount } from "wagmi";

export const useMintBaseToken = () => {
  const { address: walletAddress } = useAccount();
  const { contract } = useBaseToken();

  return async (): Promise<string> => {
    if (!contract) return "Contract not found";

    try {
      console.log("address " + walletAddress);
      const tx = await contract.mint(
        walletAddress,
        ethers.utils.parseUnits("300", 18)
      );
      await tx.wait();
      const successMessage = "Mint successful!";
      NotificationManager.success(successMessage);
      return successMessage;
    } catch (error: any) {
      let errorMessage;
      if (error.code === "ACTION_REJECTED") {
        errorMessage = "User rejected the transaction.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      NotificationManager.error(errorMessage);
      console.error("error ----------->", error);
      return errorMessage;
    }
  };
};
