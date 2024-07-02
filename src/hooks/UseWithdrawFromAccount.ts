import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useWithdrawFromAccount = () => {
  const { contract } = useOrderbook();

  return async (quantity: string, inQuote: boolean): Promise<string> => {
    if (!contract) return "Contract not found";

    try {
      const tx = await contract.withdrawFromAccount(
        ethers.utils.parseUnits(quantity, 18),
        inQuote
      );
      await tx.wait();
      const successMessage = "Withdraw from Account successful!";
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
