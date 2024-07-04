import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useDeposit = () => {
  const { contract } = useOrderbook();

  return async (
    poolId: number,
    quantity: string,
    pairedPoolId: number
  ): Promise<string> => {
    if (!contract) return "Contract not found";

    try {
      const tx = await contract.deposit(
        poolId,
        ethers.utils.parseUnits(quantity, 18),
        pairedPoolId
      );
      await tx.wait();
      const successMessage = "Deposit successful!";
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
