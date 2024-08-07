import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { useBorrow } from "../../hooks/useBorrow";
import { useDepositInCollateralAccount } from "../../hooks/UseDepositInCollateralAccount";
import { Button } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import theme from "../../theme";

import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CropDinRoundedIcon from "@mui/icons-material/CropDinRounded";
import AnalyticsButtons from "../../components/AnalyticsButtons";
import { getMetricsDataBorrowing } from "../../components/AnalyticsButtonsMetricLegend";

const Borrow = () => {
  const [borrowedQuantity, setBorrowedQuantity] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [poolId, setPoolId] = useState<string>("");
  const [textAfterClick, setTextAfterClick] = useState<string>("");
  const [textNotClickable, setTextNotClickable] = useState<string>(
    "Must enter an amount to borrow"
  );
  const [clickedRowData, setClickedRowData] = useState<any>();

  const {
    userInfo,
    poolLoading,
    orderMergedData,
    orderMergedDataUnderMarketPrice,
    refetchData,
    marketInfo,
  } = useDataContext();

  const customDataColumnsConfig = [
    {
      key: "buyPrice",
      title: "Liquidation Price",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "deposits",
      title: "Total Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "availableSupply",
      title: "Available Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
    { key: "borrowingRate", title: "Borrow APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    {
      key: "myBorrowingPositions",
      title: "My Borrowing Positions",
      metric: marketInfo.quoteTokenSymbol,
    },
  ];

  const [metricsData, setMetricsData] = useState(
    getMetricsDataBorrowing(marketInfo)
  );

  const filteredData = orderMergedDataUnderMarketPrice.filter((item) => {
    return (
      item.availableSupply !== undefined && Number(item.availableSupply) > 0
    );
  });
  //const displayedData = showAll ? filteredData : filteredData.slice(0, 3);

  let sortedData = [...filteredData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  const updateButtonClickable = (borrowedQuantity: number, price: string) => {
    const isClickable = borrowedQuantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setTextAfterClick("");
    if (borrowedQuantity == 0) {
      setTextNotClickable("Must enter a borrowed amount");
    } else if (price == "") {
      setTextNotClickable("Must select a liquidation price");
    }
  };

  const handleQuantityChange = (newQuantity: any) => {
    setBorrowedQuantity(newQuantity);
    updateButtonClickable(newQuantity, liquidationPrice);
  };

  const handleRowClick = (rowData: any) => {
    setClickedRowData(rowData);
    const newliquidationPrice = rowData.buyPrice;
    setLiquidationPrice(newliquidationPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    updateButtonClickable(borrowedQuantity, newliquidationPrice);
  };

  const borrow = useBorrow();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction sent ...");
      const result = await borrow(Number(poolId), String(borrowedQuantity));
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

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // const [open, setOpen] = useState(false);

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  return (
    <div>
      <div className="flex justify-center mt-0 mb-15">
        <AnalyticsButtons
          title="Select a pool to borrow"
          columnsConfig={customDataColumnsConfig}
          data={sortedData}
          metrics={metricsData}
          isLoading={poolLoading}
          onRowClick={handleRowClick}
          userMetricBorder={"myBorrowingPositions"}
          userMetricBorderColor={theme.palette.success.main}
        />
      </div>
      <div className="flex justify-center mt-5">
        <AmountCustom
          title="Amount to borrow"
          tokenWalletBalance={
            clickedRowData
              ? clickedRowData.availableSupply <
                userInfo.excessCollateral * clickedRowData.buyPrice
                ? clickedRowData.availableSupply
                : userInfo.excessCollateral * clickedRowData.buyPrice
              : 0
          }
          selectedToken={marketInfo.quoteTokenSymbol}
          ratioToUSD={1.01}
          onQuantityChange={handleQuantityChange}
        />
      </div>

      {/* <div className="flex mt-5">
        <CustomTable
          title="Select a liquidation price"
          columnsConfig={customDataColumnsConfig}
          data={displayedData}
          clickableRows={true}
          onRowClick={handleRowClick}
          isLoading={poolLoading}
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
      </Button> */}
      <div className="flex justify-center  mt-10">
        <CustomButton
          clickable={buttonClickable}
          handleClick={handleButtonClick}
          textAfterClick={textAfterClick}
          textClickable="Borrow"
          textNotClickable={textNotClickable}
          buttonWidth={300}
          borderRadius={50}
        />
      </div>
    </div>
  );
};

export default Borrow;
