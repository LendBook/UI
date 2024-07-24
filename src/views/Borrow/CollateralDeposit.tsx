import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { useDepositInCollateralAccount } from "../../hooks/UseDepositInCollateralAccount";
import { useApproveBaseToken } from "../../hooks/useApproveBaseToken";

const CollateralDeposit = () => {
  const [collateralQuantity, setCollateralQuantity] = useState<number>(0);
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [textAfterClick, setTextAfterClick] = useState<string>("");

  const { userInfo, refetchData, marketInfo } = useDataContext();

  const updateButtonClickable = (collateralQuantity: number) => {
    const isClickable = collateralQuantity > 0;
    setButtonClickable(isClickable);
    setTextAfterClick("");
  };

  const handleCollateralQuantityChange = (newQuantity: any) => {
    setCollateralQuantity(newQuantity);
    updateButtonClickable(newQuantity);
  };

  const approveBaseToken = useApproveBaseToken();
  const depositInCollateralAccount = useDepositInCollateralAccount();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction approval sent ...");
      const resultApproval = await approveBaseToken(String(collateralQuantity));
      setTextAfterClick(resultApproval);

      setTextAfterClick("Transaction deposit sent ...");
      const result = await depositInCollateralAccount(
        String(collateralQuantity)
      );
      setTextAfterClick(result);
      if (result == "Transaction successful!") {
        refetchData();
        // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
        // à cause de la mise a jour asynchrone il me semble et car ya pas de synchronisation entre poolData
        // et les user data (userDeposits et userBorrows)
        refetchData();
      }
    }
  };
  return (
    <div>
      <AmountCustom
        title="Amount to deposit"
        tokenWalletBalance={userInfo.baseTokenBalance}
        selectedToken={marketInfo.baseTokenSymbol}
        ratioToUSD={3010}
        onQuantityChange={handleCollateralQuantityChange}
      />
      <div className="flex mt-5"></div>
      <CustomButton
        clickable={buttonClickable}
        handleClick={handleButtonClick}
        textClickable="Deposit collateral"
        textNotClickable="Must enter a deposit amount first"
        textAfterClick={textAfterClick}
        buttonWidth={300}
        borderRadius={50}
      />
    </div>
  );
};

export default CollateralDeposit;
