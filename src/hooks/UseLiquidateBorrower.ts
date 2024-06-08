import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../contracts/index";

export const useLiquidateBorrower = () => {
  const signer = useEthersSigner();

  return async (borrower: string, quantity: string) => {
    if (!signer || !orderbookContract) return;
    try {
      const tx = await orderbookContract
        .connect(signer)
        .liquidateBorrower(borrower, ethers.utils.parseUnits(quantity.toString(), 18));
      await tx.wait();
      NotificationManager.success("Liquidate Borrower successful!");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User rejected the transaction.");
      else NotificationManager.error("Error: " + error);
      console.log("error ----------->", error["code"]);
    }
  };
};
