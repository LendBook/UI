import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useDeposit = () => {
  const { contract } = useOrderbook();

  return async (poolId: number, quantity: string, pairedPoolId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.deposit(poolId, ethers.utils.parseUnits(quantity, 18), pairedPoolId);
      await tx.wait();
      NotificationManager.success("Deposit successful!");
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
