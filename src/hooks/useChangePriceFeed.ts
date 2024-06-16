import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useChangePriceFeed = () => {
  const { contract } = useOrderbook();

  return async (price: string) => {
    if (!contract) return;

    try {
      const tx = await contract.setPriceFeed(ethers.utils.parseUnits(price, 18));
      await tx.wait();
      NotificationManager.success("Change price ETHUSD successful!");
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
