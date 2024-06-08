import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useChangePairedPrice = () => {
  const signer = useEthersSigner();

  return async (orderId: number, newPairedPoolId: number) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .changePairedPrice(orderId, newPairedPoolId);
      await tx.wait();
      NotificationManager.success("Change Paired Price successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
