import { useCallback } from "react";
import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { useEthersSigner } from "../contracts/index";
import { NotificationManager } from "react-notifications";

export const useIncreaseSizeBorrow = () => {
  const signer = useEthersSigner();

  return useCallback(async (orderId: any, size: string) => {
    if (!signer || !orderbookContract) return;

    try {
      const tx = await orderbookContract
        .connect(signer)
        .take(orderId, ethers.utils.parseUnits(size, 18));
      await tx.wait();

      NotificationManager.success("Increase Size BorrowModule successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  }, []);
};

export default useIncreaseSizeBorrow;
