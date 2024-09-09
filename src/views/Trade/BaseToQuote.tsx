import { useEffect, useState } from "react";
import AmountCustom from "../../components/AmountCustom";
import CustomButton from "../../components/CustomButton";
import { useDataContext } from "../../context/DataContext";
import { Button } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import theme from "../../theme";
import { useDeposit } from "../../hooks/useDeposit";
import { useApproveQuoteToken } from "../../hooks/useApproveQuoteToken";
import TradeBox from "./TradeBox";
import AnalyticsButtons from "../../components/AnalyticsButtons";
import { getMetricsDataTradeBaseToQuote } from "../../components/AnalyticsButtonsMetricLegend";

const BaseToQuote = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [availableSupply, setAvailableSupply] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [buyPriceSelected, SetBuyPriceSelected] = useState<boolean>(false);

  const [textAfterClick, setTextAfterClick] = useState<string>("");
  const [textNotClickable, setTextNotClickable] = useState<string>(
    "Must select a limit price"
  );

  const {
    userInfo,
    price,
    poolLoading,
    orderMergedData,
    poolData,
    closestPoolIdUnderPriceFeed,
    refetchData,
    marketInfo,
  } = useDataContext();

  const sellOrdersWithdrawClick = (id: number) => {
    console.log(`Button clicked! ${id}`);
  };

  // const customDataColumnsConfig = [
  //   {
  //     key: "buyPrice",
  //     title: "Limit Price",
  //     metric: marketInfo.quoteTokenSymbol,
  //   },
  //   {
  //     key: "availableSupply",
  //     title: "Available supply for trading",
  //     metric: marketInfo.quoteTokenSymbol,
  //   },
  //   {
  //     key: "action",
  //     title: "",
  //     isButton: true,
  //     onButtonClick: sellOrdersWithdrawClick,
  //   },
  // ];

  const [metricsData, setMetricsData] = useState(
    getMetricsDataTradeBaseToQuote(marketInfo)
  );

  const filteredData = orderMergedData.filter(
    (item) => item.availableSupply !== 0
  );

  //take only the pools which are above price feed
  let refilteredData = filteredData.filter((item) => {
    if (typeof item.poolId === "number") {
      return item.poolId > closestPoolIdUnderPriceFeed;
    }
    return false;
  });

  refilteredData = refilteredData.map((objet) => {
    return { ...objet, action: "Trade" };
  });
  let sortedData = [...refilteredData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  const updateButtonClickable = (quantity: number, price: string) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setTextAfterClick("");
    if (quantity == 0) {
      setTextNotClickable("Must enter an amount to supply");
    } else if (price == "") {
      setTextNotClickable("Must select a buy price");
    }
  };

  const handleQuantityChange = (newQuantity: any) => {
    setSupplyAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice);
  };

  const handleRowClick = (rowData: any) => {
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    updateButtonClickable(supplyAmountQuantity, newBuyPrice);
    const newAvailableSupply = rowData.availableSupply;
    setAvailableSupply(newAvailableSupply);
    SetBuyPriceSelected(true);

    console.log(
      "parseFloat(newAvailableSupply)",
      parseFloat(newAvailableSupply)
    );
    console.log(
      "parseFloat(newAvailableSupply) / parseFloat(newBuyPrice)",
      parseFloat(newAvailableSupply) / parseFloat(newBuyPrice)
    );
    console.log("newPoolId", newPoolId);
  };

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction approval sent ...");
    }
  };

  useEffect(() => {
    // Cette fonction sera appelée chaque fois que poolData change
    console.log("poolData a changé ::", poolData);
    // Ici vous pouvez effectuer toute action nécessaire après la mise à jour de poolData
  }, [poolData]); // Mettez à jour lorsque poolData change

  return (
    <div>
      {sortedData.length !== 0 ? (
        <div className="flex justify-center mt-0 mb-15">
          <AnalyticsButtons
            title="Select a limit price to trade"
            //columnsConfig={customDataColumnsConfig}
            data={sortedData}
            metrics={metricsData}
            isLoading={poolLoading}
            onRowClick={handleRowClick}
            userMetricBorder={"mySupply"}
            userMetricBorderColor={theme.palette.primary.main}
            specificMetric={"availableSupply"}
          />
        </div>
      ) : (
        <div className="flex mt-3 mb-5">
          <span>No asset available for trading.</span>
        </div>
      )}

      {/* <div className="flex mt-5">
        <CustomTable
          title="Select a limit price for the trade"
          columnsConfig={customDataColumnsConfig}
          data={refilteredData}
          clickableRows={true}
          onRowClick={handleRowClick}
          isLoading={poolLoading}
        />
      </div> */}
      {buyPriceSelected && (
        <div className="flex justify-content align-items mt-10">
          <TradeBox
            poolId={poolId}
            sellToken="Base"
            sellTokenName={marketInfo.baseTokenSymbol}
            sellTokenRatioToUsd={price ?? 0}
            buyTokenName={marketInfo.quoteTokenSymbol}
            buyTokenRatioToUsd={1}
            sellTokenMaxSupply={
              parseFloat(availableSupply) / parseFloat(buyPrice) <
              userInfo.baseTokenBalance
                ? parseFloat(availableSupply) / parseFloat(buyPrice)
                : userInfo.baseTokenBalance
            }
            buyTokenMaxSupply={
              parseFloat(availableSupply) / parseFloat(buyPrice) <
              userInfo.baseTokenBalance
                ? parseFloat(availableSupply)
                : userInfo.baseTokenBalance * parseFloat(buyPrice)
            }
            buyPrice={parseFloat(buyPrice)}
          />
        </div>
      )}
    </div>
  );
};

export default BaseToQuote;
