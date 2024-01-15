
import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import { useEthersSigner } from "../components/Trade";

export const useBorrow = () => {
    const signer = useEthersSigner();

    return async (orderId: number, quantity: string) => {
        if (!signer || !orderbookContract) return;
        try {
            const tx = await orderbookContract.connect(signer).borrow(
                orderId,
                ethers.utils.parseUnits(quantity, 18),
            );
            await tx.wait();
            NotificationManager.success("BorrowModule successful!");
        } catch (error: any) {
            if (error["code"] === "ACTION_REJECTED")
                NotificationManager.error("User rejected the transaction.");
            else
                NotificationManager.error("Error: " + error);
            console.log("error ----------->", error["code"]);
        }
    };
};
