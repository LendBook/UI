import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useLiquidateUser = () => {
  const signer = useEthersSigner();

  return async (user: string, quantity: string) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .liquidateUser(user, ethers.utils.parseUnits(quantity, 18));
      await tx.wait();
      NotificationManager.success("Liquidate user successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
