import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { useWithdrawFromAccount } from "../../hooks/UseWithdrawFromAccount";

const CollateralWithdraw = () => {
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

  const withdrawFromAccount = useWithdrawFromAccount();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction sent ...");
      const result = await withdrawFromAccount(
        String(collateralQuantity),
        false
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
        title="Amount to withdraw"
        tokenWalletBalance={userInfo.excessCollateral}
        selectedToken={marketInfo.baseTokenSymbol}
        ratioToUSD={3010}
        onQuantityChange={handleCollateralQuantityChange}
      />
      <div className="flex mt-5"></div>
      <CustomButton
        clickable={buttonClickable}
        handleClick={handleButtonClick}
        textClickable="Withdraw collateral"
        textNotClickable="Must enter a withdraw amount first"
        textAfterClick={textAfterClick}
        buttonWidth={300}
        borderRadius={50}
      />
    </div>
  );
};

export default CollateralWithdraw;
