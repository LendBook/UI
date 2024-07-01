import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { useDepositInCollateralAccount } from "../../hooks/UseDepositInCollateralAccount";

const CollateralDeposit = () => {
  const [collateralQuantity, setCollateralQuantity] = useState<number>(0);
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [textAfterClick, setTextAfterClick] = useState<string>("");

  const updateButtonClickable = (collateralQuantity: number) => {
    const isClickable = collateralQuantity > 0;
    setButtonClickable(isClickable);
    setTextAfterClick("");
  };

  const handleCollateralQuantityChange = (newQuantity: any) => {
    setCollateralQuantity(newQuantity);
    updateButtonClickable(newQuantity);
  };

  const depositInCollateralAccount = useDepositInCollateralAccount();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction sent ...");
      const result = await depositInCollateralAccount(
        String(collateralQuantity)
      );
      setTextAfterClick(result);
    }
  };
  return (
    <div>
      <AmountCustom
        title="Amount to deposit"
        tokenWalletBalance="12.42"
        selectedToken="WETH"
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
