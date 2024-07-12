import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useDepositInCollateralAccount = () => {
  const { contract } = useOrderbook();

  return async (quantity: string): Promise<string> => {
    if (!contract) return "Contract not found";
    try {
      const tx = await contract.depositInCollateralAccount(
        ethers.utils.parseUnits(quantity, 18)
      );
      await tx.wait();
      const successMessage = "Transaction successful!";
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
