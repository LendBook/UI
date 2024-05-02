import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TradeModule from "../Trade/TradeModule";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useState } from "react";

const columns = [
  "Collateral",
  "Loan",
  "Liquidation LTV",
  "Interest Rate Model",
];
const data = [
  {
    Collateral: "Aave",
    Loan: "WETH",
    "Liquidation LTV": "86.0%",
    "Interest Rate Model": "Adaptative Curve IRM",
  },
  {
    Collateral: "WETH",
    Loan: "Aave",
    "Liquidation LTV": "86.0%",
    "Interest Rate Model": "Adaptative Curve IRM",
  },
  {
    Collateral: "Uni",
    Loan: "WETH",
    "Liquidation LTV": "86.0%",
    "Interest Rate Model": "Adaptative Curve IRM",
  },
  {
    Collateral: "WETH",
    Loan: "Uni",
    "Liquidation LTV": "86.0%",
    "Interest Rate Model": "Adaptative Curve IRM",
  },
];

const handleRowClick = (rowData: any) => {
  console.log("Row clicked:", rowData);
  // Faire quelque chose avec les données de la ligne
};

const Index = () => {
  const [currentQuantity, setCurrentQuantity] = useState("");

  // Fonction pour gérer les changements de valeur de quantity
  const handleQuantityChange = (newQuantity: any) => {
    setCurrentQuantity(newQuantity);
    console.log("New Quantity:", newQuantity);
  };

  return (
    <div>
      <div className="container" style={{ marginBottom: "10px" }}>
        <AmountCustom
          title="Collateral Amount"
          tokenWalletBalance="4050"
          selectedToken="USDC"
          ratioToUSD={1.01}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="container">
        <span className="text-error text-[12px] font-bold">
          Test : on appelle la Quantity {currentQuantity}
        </span>
      </div>

      <div className="flex mt-10">
        <div className="container">
          <TableCustom
            title="Select a Liquidation Price"
            data={data}
            clickableRows={true}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
