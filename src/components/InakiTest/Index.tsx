import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TradeModule from "../Trade/TradeModule";
import TableCustom from "../TableCustom";

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
  return (
    <div>
      <TableCustom
        data={data}
        clickableRows={true}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Index;
