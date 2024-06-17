import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useWithdrawFromAccount = () => {
  const { contract } = useOrderbook();

  return async (quantity: string, inQuote: boolean) => {
    if (!contract) return;

    try {
      const tx = await contract.withdrawFromAccount(ethers.utils.parseUnits(quantity, 18), inQuote);
      await tx.wait();
      NotificationManager.success("Withdraw from Account successful!");
    } catch (error: any) {
      if (error.code === "ACTION_REJECTED") {
        NotificationManager.error("User rejected the transaction.");
      } else {
        NotificationManager.error("Error: " + error.message);
      }
      console.error("error ----------->", error);
    }
  };
};
