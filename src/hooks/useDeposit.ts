import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useDeposit = () => {
  const signer = useEthersSigner();

  return async (poolId: number, quantity: string, pairedPoolId: number) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .deposit(poolId, ethers.utils.parseUnits(quantity.toString(), 18), pairedPoolId);
      await tx.wait();
      NotificationManager.success("Deposit successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
