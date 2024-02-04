import { ethers } from "ethers";
import { orderbookContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import {useEthersSigner} from "../contracts/index";

export const useChangePriceFeed = () => {
    const signer = useEthersSigner();

    return async (price: string) => {
        if (!signer || !orderbookContract) return;
        try {
            const tx = await orderbookContract.connect(signer).setPriceFeed(
                ethers.utils.parseUnits(price, 18),
            );
            await tx.wait();
            NotificationManager.success("Change price ETHUSD successful!");
        } catch (error: any) {
            if (error["code"] === "ACTION_REJECTED")
                NotificationManager.error("User rejected the transaction.");
            else
                NotificationManager.error("Error: " + error);
            console.log("error ----------->", error["code"]);
        }
    };
};