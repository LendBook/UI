// useChangeBorrowable.tsx

import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../components/Trade";

export const useChangeBorrowable = () => {
    const signer = useEthersSigner();

    return async (orderId: number, isBorrowable: boolean) => {
        if (!signer || !orderbookContract) return;
        try {
            const tx = await orderbookContract.connect(signer).changeBorrowable(
                orderId,
                isBorrowable
            );
            await tx.wait();
            NotificationManager.success("Order borrowable status changed!");
        } catch (error: any) {
            if (error["code"] === "ACTION_REJECTED")
                NotificationManager.error("User rejected the transaction.");
            else
                NotificationManager.error("Error: " + error);
            console.log("error ----------->", error["code"]);
        }
    };
};
