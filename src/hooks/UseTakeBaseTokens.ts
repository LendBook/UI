import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useTakeBaseTokens = () => {
  const { contract } = useOrderbook();

  return async (poolId: number, quantity: string) => {
    if (!contract) return;

    try {
      const tx = await contract.takeBaseTokens(poolId, ethers.utils.parseUnits(quantity, 18));
      await tx.wait();
      NotificationManager.success("Take Base Tokens successful!");
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
