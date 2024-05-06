import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TradeModule from "../Trade/TradeModule";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";

const dataTable = [
  {
    "Buy Price": "3,400 USDC",
    "Total Supply": "10M USDC",
    "Net APY": "10.3%",
    Utilization: "85%",
    "My Supply": "",
  },
  {
    "Buy Price": "3,200 USDC",
    "Total Supply": "8.2M USDC",
    "Net APY": "7.8%",
    Utilization: "76%",
    "My Supply": "7,000 USDC",
  },
  {
    "Buy Price": "3,000 USDC",
    "Total Supply": "3.3M USDC",
    "Net APY": "6.1%",
    Utilization: "60%",
    "My Supply": "3,000 USDC",
  },
];

const dataMetric = [
  {
    title: "My total Supply",
    value: "10000",
    unit: "USDC",
  },
];

const Index = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState("");
  const [buttonClickable, setButtonClickable] = useState(false);
  const [message, setMessage] = useState("");

  const updateButtonClickable = (supplyAmountQuantity: any, buyPrice: any) => {
    if (supplyAmountQuantity > 0 && buyPrice !== "") {
      setButtonClickable(true);
    } else {
      setButtonClickable(false);
    }
    setMessage(
      "Transaction parameters : supply=" +
        supplyAmountQuantity +
        " AND buy price =" +
        buyPrice
    );
  };

  // Fonction pour gérer les changements de valeur de quantity
  const handleQuantityChange = (newQuantity: any) => {
    setSupplyAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice);
  };

  const handleRowClick = (rowData: any) => {
    setBuyPrice(rowData["Buy Price"]);
    updateButtonClickable(supplyAmountQuantity, rowData["Buy Price"]);
  };

  const handleButtonClick = () => {
    setMessage("Button clicked!");
  };

  return (
    <Card
      sx={{
        maxWidth: "1100px",
        margin: "auto",
        background: "transparent",
        boxShadow: "none",
        border: "none",
      }}
    >
      <Box>
        <div>
          <div className=" mt-24  text-primary text-[48px] font-bold">
            Lend to Earn
          </div>
          <div className="flex space-between items-baseline">
            <div className="container" style={{ marginBottom: "10px" }}>
              <AmountCustom
                title="Supply Amount"
                tokenWalletBalance="11320"
                selectedToken="USDC"
                ratioToUSD={1.01}
                onQuantityChange={handleQuantityChange}
              />
            </div>

            <div className="flex mt-10">
              <div className="container">
                <MetricCustom data={dataMetric} />
              </div>
            </div>
          </div>

          <div className="flex mt-10">
            <div className="container">
              <TableCustom
                title="Select a Buy Price"
                data={dataTable}
                clickableRows={true}
                onRowClick={handleRowClick}
              />
            </div>
          </div>

          <div className="flex mt-10">
            <div className="container">
              <CustomButton
                clickable={buttonClickable}
                handleClick={handleButtonClick}
                textClickable="Finalize transaction"
                textNotClickable="Finalize transaction"
                buttonWidth={300}
                borderRadius={50}
              />
            </div>
          </div>
          <div className="container">
            <span className="text-success text-[12px] font-bold">
              {message}
            </span>
          </div>
        </div>
      </Box>
    </Card>
  );
};

export default Index;
