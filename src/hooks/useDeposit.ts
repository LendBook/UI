
import {ethers} from "ethers";
import {orderbookContract} from "../contracts";
import {NotificationManager} from "react-notifications";
import {useEthersSigner} from "../contracts/index";

export const useDeposit = (quantity: string, buyPrice: string, pairedPrice: string, b: boolean, b1: boolean) => {
    const signer = useEthersSigner();

    return async (_quantity: { toString: () => string; }, _price: { toString: () => string; }, _pairedPrice: {
            toString: () => string;
        }, _isBuyOrder: any, _isBorrowable: any) => {
            if (!signer || !orderbookContract) return;
            try {
                console.log(_quantity.toString, _price.toString, _pairedPrice.toString);
                const tx = await orderbookContract.connect(signer).deposit(
                    ethers.utils.parseUnits(_quantity.toString(), 18),
                    ethers.utils.parseUnits(_price.toString(), 18),
                    ethers.utils.parseUnits(_pairedPrice.toString(), 18),
                    _isBuyOrder,
                    _isBorrowable
                );
                await tx.wait();
                NotificationManager.success("Deposit Success !");
            } catch (error: any) {
                if (error["code"] === "ACTION_REJECTED")
                    NotificationManager.error("User Rejected transaction.");
                else NotificationManager.error("Error " + error);
                console.log("error ----------->", error["code"]);
            }
        };
};
