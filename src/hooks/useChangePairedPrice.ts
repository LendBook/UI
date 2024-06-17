import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useChangePairedPrice = () => {
  const { contract } = useOrderbook();

  return async (orderId: number, newPairedPoolId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.changePairedPrice(orderId, newPairedPoolId);
      await tx.wait();
      NotificationManager.success("Change Paired Price successful!");
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
