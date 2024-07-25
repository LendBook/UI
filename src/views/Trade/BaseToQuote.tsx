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

  const customDataColumnsConfig = [
    {
      key: "buyPrice",
      title: "Limit Price",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "availableSupply",
      title: "Available supply for trading",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "action",
      title: "",
      isButton: true,
      onButtonClick: sellOrdersWithdrawClick,
    },
  ];

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
  console.log("refilteredData ", refilteredData);

  refilteredData = refilteredData.map((objet) => {
    return { ...objet, action: "Trade" };
  });

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
  };

  const handleButtonClick = async () => {
    //setMessage("Button clicked!");
    if (buttonClickable) {
      setTextAfterClick("Transaction approval sent ...");
    }
  };

  useEffect(() => {
    // Cette fonction sera appelée chaque fois que poolData change
    console.log("poolData a changé :", poolData);
    // Ici vous pouvez effectuer toute action nécessaire après la mise à jour de poolData
  }, [poolData]); // Mettez à jour lorsque poolData change

  return (
    <div>
      <div className="flex mt-5">
        <CustomTable
          title="Select a limit price for the trade"
          columnsConfig={customDataColumnsConfig}
          data={refilteredData}
          clickableRows={true}
          onRowClick={handleRowClick}
          isLoading={poolLoading}
        />
      </div>
      {/* <div className="flex mt-5">
        <AmountCustom
          title="Amount to supply"
          tokenWalletBalance={376}
          selectedToken={quote}
          ratioToUSD={1.01}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="flex mt-10">
        <CustomButton
          clickable={buttonClickable}
          handleClick={handleButtonClick}
          textAfterClick={textAfterClick}
          textClickable="Finalize trade"
          textNotClickable={textNotClickable}
          buttonWidth={300}
          borderRadius={50}
        />
      </div> */}
      {buyPriceSelected && (
        <div className="flex justify-content align-items mt-10">
          <TradeBox
            poolId={poolId}
            sellToken="Base"
            sellTokenName={marketInfo.baseTokenSymbol}
            sellTokenWalletBalance={911}
            sellTokenRatioToUsd={price ?? 0}
            buyTokenName={marketInfo.quoteTokenSymbol}
            buyTokenWalletBalance={911}
            buyTokenRatioToUsd={1}
            buyTokenMaxSupply={parseFloat(availableSupply)}
            buyPrice={parseFloat(buyPrice)}
          />
        </div>
      )}
    </div>
  );
};

export default BaseToQuote;
