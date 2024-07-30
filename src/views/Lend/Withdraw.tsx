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

const Withdraw = () => {
  const [withdrawAmountQuantity, setWithdrawAmountQuantity] =
    useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [orderLenderId, setOrderLenderId] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

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

  const customDataColumnsConfig = [
    {
      key: "buyPrice",
      title: "Buy Price",
      metric: marketInfo.quoteTokenSymbol,
    },
    //{ key: "orderLenderId", title: "orderLenderId" },
    {
      key: "deposits",
      title: "Total Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
    { key: "lendingRate", title: "Net APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    {
      key: "mySupply",
      title: "My Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
  ];

  const [metricsData, setMetricsData] = useState([
    {
      key: "buyPrice",
      title: "Buy Price",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
      color: theme.palette.info.main,
    },
    {
      key: "deposits",
      title: "Supply",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
      color: theme.palette.primary.main,
      icon: <SquareRoundedIcon fontSize="small" />,
    },
    {
      key: "borrows",
      title: "Borrow",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
      color: theme.palette.success.main,
      icon: <SquareRoundedIcon fontSize="small" />,
    },
    {
      key: "mySupply",
      title: "My supply",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
      color: theme.palette.primary.main,
      icon: <CropDinRoundedIcon fontSize="small" />,
    },
    {
      key: "lendingRate",
      title: "Net APY",
      value: "0",
      unit: "%",
      color: theme.palette.info.main,
    },
    {
      key: "utilizationRate",
      title: "Utilization",
      value: "0",
      unit: "%",
      color: theme.palette.info.main,
    },
  ]);

  const filteredData = orderMergedDataUnderMarketPrice.filter(
    (item) => item.orderLenderId !== undefined
  );

  //const displayedData = showAll ? filteredData : filteredData.slice(0, 3);

  let sortedData = [...filteredData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  const sellOrdersWithdrawClick = (id: number) => {
    console.log(`Button clicked! ${id}`);
  };

  const sellOrdersDataColumnsConfig = [
    { key: "sellPrice", title: "Sell Price" },
    { key: "mySupply", title: "My Supply" },
    {
      key: "action",
      title: "",
      isButton: true,
      onButtonClick: sellOrdersWithdrawClick,
    },
  ];

  const sellOrdersData = [
    {
      id: 1,
      sellPrice: "8,200 USDC",
      mySupply: "3.3 WETH",
      action: "Withdraw",
    },
  ];

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
          title="Select a pool to supply"
          columnsConfig={customDataColumnsConfig}
          data={sortedData}
          metrics={metricsData}
          isLoading={poolLoading}
          onRowClick={handleRowClick}
        />
      </div>
      {/* <Box
        sx={{
          width: "75%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            padding: 1,
            display: "inline-block",
            border: `1px solid ${theme.palette.primary.main}`,
            width: "100%",
          }}
          className="flex"
        >
          <CustomTable
            title="Sell orders to withdraw (no earnings)"
            columnsConfig={sellOrdersDataColumnsConfig}
            data={sellOrdersData}
            clickableRows={false}
          />
        </Paper>
      </Box> */}
      <div className="flex mt-10"></div>
      <AmountCustom
        title="Amount to withdraw"
        tokenWalletBalance={376}
        selectedToken={marketInfo.quoteTokenSymbol}
        ratioToUSD={1.01}
        onQuantityChange={handleQuantityChange}
      />

      <div className="flex mt-5">
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
      </Button>
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
