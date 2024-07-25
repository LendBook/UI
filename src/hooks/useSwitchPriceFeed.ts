import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useSwitchPriceFeed = () => {
  const { contract } = useOrderbook();

  return async () => {
    if (!contract) return;

    try {
      const tx = await contract.switchPriceFeed();
      await tx.wait();
      NotificationManager.success("Switch price successful!");
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
