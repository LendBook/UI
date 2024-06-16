import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { useOrderbook } from "./useOrderbook";

export const useDepositInCollateralAccount = () => {
  const { contract } = useOrderbook();

  return async (quantity: string) => {
    if (!contract) return;

    try {
      const tx = await contract.depositInCollateralAccount(ethers.utils.parseUnits(quantity, 18));
      await tx.wait();
      NotificationManager.success("Deposit in Collateral Account successful!");
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
