import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import {useEthersSigner} from "../contracts/index";

export const useMint = (tokenContract: { connect: (arg0: ethers.providers.JsonRpcSigner) => { (): any; new(): any; mint: { (arg0: string, arg1: ethers.BigNumber): any; new(): any; }; }; }) => {
    const signer = useEthersSigner();

    return async (to: string, amount: string) => {
        if (!signer || !tokenContract) return;
        try {
            const parsedAmount = ethers.utils.parseUnits(amount, 18);
            const tx = await tokenContract.connect(signer).mint(
                to,
                parsedAmount,
            );
            await tx.wait();
            NotificationManager.success("Mint successful!");
        } catch (error: any) {
            if (error["code"] === "ACTION_REJECTED")
                NotificationManager.error("User rejected the transaction.");
            else
                NotificationManager.error("Error: " + error);
            console.log("error ----------->", error["code"]);
        }
    };
};



