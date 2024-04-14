import { useCallback } from "react";
import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { useEthersSigner } from "../contracts/index";
import { NotificationManager } from "react-notifications";

export const useChangeLimitPrice = () => {
  const signer = useEthersSigner();

  return useCallback(async (orderId: any, newLimitPrice: string) => {
    if (!signer || !orderbookContract) return;

    try {
      const tx = await orderbookContract
        .connect(signer)
        .changeLimitPrice(orderId, ethers.utils.parseUnits(newLimitPrice, 18));
      await tx.wait();

      NotificationManager.success("Change Limit Price successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  }, []);
};

export default useChangeLimitPrice;
