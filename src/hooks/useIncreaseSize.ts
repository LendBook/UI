import {ethers} from "ethers";
import {useCallback} from "react";
import {orderbookContract} from "../contracts";
import {useEthersSigner} from "../contracts/index";
import {NotificationManager} from "react-notifications";


const useIncreaseSize = () => {
    const signer = useEthersSigner();
    return useCallback(async (newSize: string, price: string, pairedPrice: string, isBuyOrder : boolean, isBorrowable : boolean) => {
        if (!signer || !orderbookContract) return;
        try {
            const transaction = await orderbookContract.connect(signer).deposit(ethers.utils.parseUnits(newSize, 18), price, pairedPrice, isBuyOrder, isBorrowable);
            await transaction.wait();

            NotificationManager.success("Increase Size successful!");
        } catch (error: any) {
            if (error["code"] === "ACTION_REJECTED")
                NotificationManager.error("User rejected the transaction.");
            else
                NotificationManager.error("Error: " + error);
            console.log("error ----------->", error["code"]);
        }
    }, []);
};

export default useIncreaseSize;
