import { useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { Box, Button, Paper } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import theme from "../../theme";
import { useWithdraw } from "../../hooks/useWithdraw";
import AnalyticsButtons from "../../components/AnalyticsButtons";

import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CropDinRoundedIcon from "@mui/icons-material/CropDinRounded";
import {
  getMetricsDataLending,
  getMetricsDataLendingWithdraw,
} from "../../components/AnalyticsButtonsMetricLegend";

const Withdraw = () => {
  const [withdrawAmountQuantity, setWithdrawAmountQuantity] =
    useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [orderLenderId, setOrderLenderId] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [clickedRowData, setClickedRowData] = useState<any>();

  const [textAfterClick, setTextAfterClick] = useState<string>("");
  const [textNotClickable, setTextNotClickable] = useState<string>(
    "Must enter an amount to withdraw"
  );

  const {
    poolLoading,
    orderMergedData,
    orderMergedDataUnderMarketPrice,
    poolData,
    refetchData,
    marketInfo,
  } = useDataContext();

  const [metricsData, setMetricsData] = useState(
    getMetricsDataLendingWithdraw(marketInfo)
  );

  const filteredData = orderMergedData.filter(
    (item) => item.orderLenderId !== undefined
  );

  // TODO
  // besoin de s'occuper de la partie où le lender a de la supply en base token et non en quote token
  // du coup il faut créer une nouvelle variable mySupplyInETH
  filteredData.forEach((item) => {
    if (parseFloat(item.borrows as string) !== 0) {
      item.mySupplyInETH = item.mySupply; // Ajoute `mySupplyInETH` uniquement si `mySupply` est différent de 0
    }
  });

  let sortedData = [...filteredData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  const updateButtonClickable = (quantity: number, price: string) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setTextAfterClick("");
    if (quantity == 0) {
      setTextNotClickable("Must enter an amount to withdraw");
    } else if (price == "") {
      setTextNotClickable("Must select a position");
    }
  };

  const handleQuantityChange = (newQuantity: any) => {
    setWithdrawAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice);
  };

  const handleRowClick = (rowData: any) => {
    setClickedRowData(rowData);
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    const newOrderId = rowData.orderLenderId;
    setOrderLenderId(newOrderId);
    updateButtonClickable(withdrawAmountQuantity, newBuyPrice);
  };

  const withdraw = useWithdraw();

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction sent ...");
      const result = await withdraw(
        Number(orderLenderId),
        String(withdrawAmountQuantity)
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

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="flex mt-0 mb-15">
        <AnalyticsButtons
          title="Select a pool to withdraw"
          data={sortedData}
          metrics={metricsData}
          isLoading={poolLoading}
          onRowClick={handleRowClick}
          userMetricBorder={"mySupply"}
          userMetricBorderColor={theme.palette.primary.main}
        />
      </div>
      {/* <div className="flex mt-10"></div> */}
      <div className="flex mt-5">
        <AmountCustom
          title="Amount to withdraw"
          tokenWalletBalance={clickedRowData ? clickedRowData.mySupply : 0}
          selectedToken={marketInfo.quoteTokenSymbol}
          ratioToUSD={1.01}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      {/* <div className="flex mt-5">
        <CustomTable
          title="Select a lending position to withdraw"
          columnsConfig={customDataColumnsConfig}
          data={filteredData}
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
      <div className="flex mt-10">
        <CustomButton
          clickable={buttonClickable}
          handleClick={handleButtonClick}
          textAfterClick={textAfterClick}
          textClickable="Withdraw"
          textNotClickable={textNotClickable}
          buttonWidth={300}
          borderRadius={50}
        />
      </div>
    </div>
  );
};

export default Withdraw;
