import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useWithdrawFromAccount = () => {
  const signer = useEthersSigner();

  return async (quantity: string, inQuote: boolean) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .withdrawFromAccount(ethers.utils.parseUnits(quantity, 18), inQuote);
      await tx.wait();
      NotificationManager.success("Withdraw from Account successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
