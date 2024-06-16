import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useLiquidateUser = () => {
  const { contract } = useOrderbook();

  return async (user: string, quantity: string) => {
    if (!contract) return;

    try {
      const tx = await contract.liquidateUser(user, ethers.utils.parseUnits(quantity, 18));
      await tx.wait();
      NotificationManager.success("Liquidate user successful!");
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
