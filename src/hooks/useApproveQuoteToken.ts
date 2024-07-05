import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useQuoteToken } from "./useQuoteToken";
import { useAccount } from "wagmi";
import { useOrderbook } from "./useOrderbook";

export const useApproveQuoteToken = () => {
  const { address: walletAddress } = useAccount();
  const { contract } = useQuoteToken();
  const { contract: bookAddress } = useOrderbook();

  return async (quantity: string): Promise<string> => {
    if (!contract) return "Contract not found";

    try {
      console.log("bookAddress " + bookAddress?.address);
      const tx = await contract.approve(
        bookAddress?.address,
        ethers.utils.parseUnits(quantity, 18)
      );
      await tx.wait();
      const successMessage = "approve successful!";
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
