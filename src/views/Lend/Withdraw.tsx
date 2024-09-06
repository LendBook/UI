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
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [clickedRowData, setClickedRowData] = useState<any>();
  const [poolSelected, SetPoolSelected] = useState<string>("");

  const [orderLenderIdQuote, setOrderLenderIdQuote] = useState<string>("");
  const [withdrawAmountQuantityQuote, setWithdrawAmountQuantityQuote] =
    useState<number>(0);
  const [buttonClickableQuote, setButtonClickableQuote] =
    useState<boolean>(false);
  const [textAfterClickQuote, setTextAfterClickQuote] = useState<string>("");
  const [textNotClickableQuote, setTextNotClickableQuote] = useState<string>(
    "Must enter an amount to withdraw"
  );

  const [orderLenderIdBase, setOrderLenderIdBase] = useState<string>("");
  const [withdrawAmountQuantityBase, setWithdrawAmountQuantityBase] =
    useState<number>(0);
  const [buttonClickableBase, setButtonClickableBase] =
    useState<boolean>(false);
  const [textAfterClickBase, setTextAfterClickBase] = useState<string>("");
  const [textNotClickableBase, setTextNotClickableBase] = useState<string>(
    "Must enter an amount to withdraw"
  );

  const {
    price,
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

  // const filteredData = orderMergedData.filter(
  //   (item) => item.orderLenderId !== undefined
  // );
  const filteredData = orderMergedData.filter(
    (item) =>
      item.mySupplyCumulated !== undefined &&
      parseFloat(item.mySupplyCumulated as string) !== 0
  );

  let sortedData = [...filteredData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  const withdraw = useWithdraw();

  const updateButtonClickableQuote = (quantity: number, price: string) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickableQuote(isClickable);
    setTextAfterClickQuote("");
    if (quantity == 0) {
      setTextNotClickableQuote("Must enter an amount to withdraw");
    } else if (price == "") {
      setTextNotClickableQuote("Must select a position");
    }
  };
  const handleQuantityChangeQuote = (newQuantity: any) => {
    setWithdrawAmountQuantityQuote(newQuantity);
    updateButtonClickableQuote(newQuantity, buyPrice);
  };
  const handleButtonClickQuote = async () => {
    //setMessage("Button clicked!");
    if (buttonClickableQuote) {
      setTextAfterClickQuote("Transaction sent ...");
      console.log("orderLenderIdQuote", orderLenderIdQuote);
      const result = await withdraw(
        Number(orderLenderIdQuote),
        String(withdrawAmountQuantityQuote)
      );
      setTextAfterClickQuote(result);
      if (result == "Transaction successful!") {
        refetchData();
        // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
        // à cause de la mise a jour asynchrone il me semble et car ya pas de synchronisation entre poolData
        // et les user data (userDeposits et userBorrows)
        refetchData();
      }
    }
  };

  const updateButtonClickableBase = (quantity: number, price: string) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickableBase(isClickable);
    setTextAfterClickBase("");
    if (quantity == 0) {
      setTextNotClickableBase("Must enter an amount to withdraw");
    } else if (price == "") {
      setTextNotClickableBase("Must select a position");
    }
  };
  const handleQuantityChangeBase = (newQuantity: any) => {
    setWithdrawAmountQuantityBase(newQuantity);
    updateButtonClickableBase(newQuantity, buyPrice);
  };
  const handleButtonClickBase = async () => {
    //setMessage("Button clicked!");
    if (buttonClickableBase) {
      setTextAfterClickBase("Transaction sent ...");
      console.log("orderLenderIdBase", orderLenderIdBase);
      const result = await withdraw(
        Number(orderLenderIdBase),
        String(withdrawAmountQuantityBase)
      );
      setTextAfterClickBase(result);
      if (result == "Transaction successful!") {
        refetchData();
        // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
        // à cause de la mise a jour asynchrone il me semble et car ya pas de synchronisation entre poolData
        // et les user data (userDeposits et userBorrows)
        refetchData();
      }
    }
  };

  const handleRowClick = (rowData: any) => {
    setClickedRowData(rowData);
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);

    // different conditions based on the lender supply (if it's in base token or quote token or both)
    if (rowData.mySupplyQuote > 0 && rowData.mySupplyBase > 0) {
      const newOrderIdQuote = rowData.orderLenderIdQuote;
      setOrderLenderIdQuote(newOrderIdQuote);
      updateButtonClickableQuote(withdrawAmountQuantityQuote, newBuyPrice);
      const newOrderIdBase = rowData.orderLenderIdBase;
      setOrderLenderIdBase(newOrderIdBase);
      updateButtonClickableBase(withdrawAmountQuantityBase, newBuyPrice);
      SetPoolSelected("quoteTokenAndBaseToken");
    } else if (rowData.mySupplyQuote > 0) {
      const newOrderIdQuote = rowData.orderLenderIdQuote;
      setOrderLenderIdQuote(newOrderIdQuote);
      updateButtonClickableQuote(withdrawAmountQuantityQuote, newBuyPrice);
      SetPoolSelected("quoteToken");
    } else if (rowData.mySupplyBase > 0) {
      const newOrderIdBase = rowData.orderLenderIdBase;
      setOrderLenderIdBase(newOrderIdBase);
      updateButtonClickableBase(withdrawAmountQuantityBase, newBuyPrice);
      SetPoolSelected("baseToken");
    }
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
          userMetricBorder={"mySupplyCumulated"}
          userMetricBorderColor={theme.palette.primary.main}
        />
      </div>
      {poolSelected !== "" && (
        <div>
          {poolSelected === "quoteToken" && (
            <>
              <div className="flex mt-5">
                <AmountCustom
                  title={`Withdraw ${marketInfo.quoteTokenSymbol}`}
                  tokenWalletBalance={
                    clickedRowData
                      ? clickedRowData.availableSupplyToBorrow * 0.98 < //*0.98 is a buffer because we do not calculate interests in the dapp
                        clickedRowData.mySupplyQuote
                        ? clickedRowData.availableSupplyToBorrow * 0.98
                        : clickedRowData.mySupplyQuote
                      : 0
                  }
                  selectedToken={marketInfo.quoteTokenSymbol}
                  ratioToUSD={1}
                  onQuantityChange={handleQuantityChangeQuote}
                />
              </div>
              <div className="flex mt-10">
                <CustomButton
                  clickable={buttonClickableQuote}
                  handleClick={handleButtonClickQuote}
                  textAfterClick={textAfterClickQuote}
                  textClickable={`Withdraw ${marketInfo.quoteTokenSymbol}`}
                  textNotClickable={textNotClickableQuote}
                  buttonWidth={300}
                  borderRadius={50}
                />
              </div>
            </>
          )}
          {poolSelected === "baseToken" && (
            <>
              <div className="flex mt-5">
                <AmountCustom
                  title={`Withdraw ${marketInfo.baseTokenSymbol}`}
                  tokenWalletBalance={
                    clickedRowData ? clickedRowData.mySupplyBase : 0
                  }
                  selectedToken={marketInfo.baseTokenSymbol}
                  ratioToUSD={price as number}
                  onQuantityChange={handleQuantityChangeBase}
                />
              </div>
              <div className="flex mt-10">
                <CustomButton
                  clickable={buttonClickableBase}
                  handleClick={handleButtonClickBase}
                  textAfterClick={textAfterClickBase}
                  textClickable={`Withdraw ${marketInfo.baseTokenSymbol}`}
                  textNotClickable={textNotClickableBase}
                  buttonWidth={300}
                  borderRadius={50}
                />
              </div>
            </>
          )}
          {poolSelected === "quoteTokenAndBaseToken" && (
            <div className="flex flex-start">
              <div>
                <div className="flex mt-5">
                  <AmountCustom
                    title={`Withdraw ${marketInfo.quoteTokenSymbol}`}
                    tokenWalletBalance={
                      clickedRowData
                        ? clickedRowData.availableSupplyToBorrow * 0.99 < //*0.99 is a buffer because we do not calculate interests in the dapp
                          clickedRowData.mySupplyQuote
                          ? clickedRowData.availableSupplyToBorrow * 0.99
                          : clickedRowData.mySupplyQuote
                        : 0
                    }
                    selectedToken={marketInfo.quoteTokenSymbol}
                    ratioToUSD={1}
                    onQuantityChange={handleQuantityChangeQuote}
                  />
                </div>
                <div className="flex mt-10">
                  <CustomButton
                    clickable={buttonClickableQuote}
                    handleClick={handleButtonClickQuote}
                    textAfterClick={textAfterClickQuote}
                    textClickable={`Withdraw ${marketInfo.quoteTokenSymbol}`}
                    textNotClickable={textNotClickableQuote}
                    buttonWidth={300}
                    borderRadius={50}
                  />
                </div>
              </div>
              <div className="ml-20">
                <div className="flex mt-5">
                  <AmountCustom
                    title={`Withdraw ${marketInfo.baseTokenSymbol}`}
                    tokenWalletBalance={
                      clickedRowData ? clickedRowData.mySupplyBase : 0
                    }
                    selectedToken={marketInfo.baseTokenSymbol}
                    ratioToUSD={price as number}
                    onQuantityChange={handleQuantityChangeBase}
                  />
                </div>
                <div className="flex mt-10">
                  <CustomButton
                    clickable={buttonClickableBase}
                    handleClick={handleButtonClickBase}
                    textAfterClick={textAfterClickBase}
                    textClickable={`Withdraw ${marketInfo.baseTokenSymbol}`}
                    textNotClickable={textNotClickableBase}
                    buttonWidth={300}
                    borderRadius={50}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Withdraw;
