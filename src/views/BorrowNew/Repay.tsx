import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { useBorrow } from "../../hooks/useBorrow";
import { useDepositInCollateralAccount } from "../../hooks/UseDepositInCollateralAccount";
import { Button } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import theme from "../../theme";
import { useRepay } from "../../hooks/useRepay";

const Repay = () => {
  const [repayQuantity, setRepayQuantity] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [poolId, setPoolId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [textAfterClick, setTextAfterClick] = useState<string>("");
  const [textNotClickable, setTextNotClickable] = useState<string>(
    "Must enter an amount to repay"
  );

  const {
    userInfo,
    userDeposits,
    loadingUser,
    pricePoolId,
    pricePoolIdLoading,
    pricePoolIdError,
    orderData,
    orderLoading,
    orderError,
    orderMergedData,
  } = useDataContext();

  const customDataColumnsConfig = [
    { key: "buyPrice", title: "Liquidation Price", metric: "USDC" },
    { key: "deposits", title: "Total Supply", metric: "USDC" },
    { key: "availableSupply", title: "Available Supply", metric: "USDC" },
    { key: "borrowingRate", title: "Borrow APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    {
      key: "myBorrowingPositions",
      title: "My Borrowing Positions",
      metric: "USDC",
    },
  ];

  const displayedData = showAll ? orderMergedData : orderMergedData.slice(0, 3);

  const updateButtonClickable = (borrowedQuantity: number, price: string) => {
    const isClickable = borrowedQuantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setTextAfterClick("");
    if (borrowedQuantity == 0) {
      setTextNotClickable("Must enter an amount to repay");
    } else if (price == "") {
      setTextNotClickable("Must select a position");
    }
  };

  const handleQuantityChange = (newQuantity: any) => {
    setRepayQuantity(newQuantity);
    updateButtonClickable(newQuantity, liquidationPrice);
  };

  const handleRowClick = (rowData: any) => {
    const newliquidationPrice = rowData.buyPrice;
    setLiquidationPrice(newliquidationPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    const newOrderId = rowData.orderId;
    setOrderId(newOrderId);
    updateButtonClickable(repayQuantity, newliquidationPrice);
  };

  const repay = useRepay();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick(
        "Transaction sent ..." +
          String(Number(orderId)) +
          " " +
          String(repayQuantity)
      );
      const result = await repay(Number(orderId), String(repayQuantity));
      setTextAfterClick(result);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <AmountCustom
        title="Amount to repay"
        tokenWalletBalance="376"
        selectedToken="USDC"
        ratioToUSD={1.01}
        onQuantityChange={handleQuantityChange}
      />

      <div className="flex mt-5">
        <CustomTable
          title="Select a position to repay"
          columnsConfig={customDataColumnsConfig}
          data={displayedData}
          clickableRows={true}
          onRowClick={handleRowClick}
          isLoading={orderLoading}
        />
      </div>
      <Button
        onClick={toggleShowAll}
        style={{
          float: "right", // Aligner à droite
          textTransform: "none",
          color: theme.palette.text.primary,
        }}
      >
        {showAll ? "show less" : "show more"}
      </Button>
      <div className="flex mt-10">
        <CustomButton
          clickable={buttonClickable}
          handleClick={handleButtonClick}
          textAfterClick={textAfterClick}
          textClickable="Repay"
          textNotClickable={textNotClickable}
          buttonWidth={300}
          borderRadius={50}
        />
      </div>
    </div>
  );
};

export default Repay;
