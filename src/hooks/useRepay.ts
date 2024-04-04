// useRepay.tsx

import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useRepay = () => {
  const signer = useEthersSigner();

  return async (positionId: number, repaidQuantity: string) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .repay(positionId, ethers.utils.parseUnits(repaidQuantity, 18));
      await tx.wait();
      NotificationManager.success("Repayment successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
