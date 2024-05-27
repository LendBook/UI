import { Box, Card, Typography, Button } from "@mui/material";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import TabsCustom from "../TabsCustom";

const Index = () => {
  const [collateralQuantity, setCollateralQuantity] = useState<number>(0);
  const [borrowedQuantity, setBorrowedQuantity] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const data = [
    {
      "Liquidation Price": "3,400 USDC",
      "Available Supply": "10M USDC",
      "Borrow APY": "10.3%",
      Utilization: "95%",
      "My Borrowing positons": "",
    },
    {
      "Liquidation Price": "3,200 USDC",
      "Available Supply": "8.2M USDC",
      "Borrow APY": "7.8%",
      Utilization: "90%",
      "My Borrowing positons": "7000 USDC",
    },
    {
      "Liquidation Price": "3,000 USDC",
      "Available Supply": "3.3M USDC",
      "Borrow APY": "6.1%",
      Utilization: "60%",
      "My Borrowing positons": "",
    },
    {
      "Liquidation Price": "2,800 USDC",
      "Available Supply": "1.2M USDC",
      "Borrow APY": "6.0%",
      Utilization: "60%",
      "My Borrowing positons": "",
    },
  ];

  const updateButtonClickable = (
    collateralQuantity: number,
    borrowedQuantity: number,
    price: string
  ) => {
    const isClickable = borrowedQuantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setMessage(
      `Transaction parameters: collateralQuantity=${collateralQuantity} AND borrowedQuantity=${borrowedQuantity} AND buy price=${price}`
    );
  };

  const handleToggleClick = (label: string) => {
    setMessage(`${label}`);
  };

  const handleCollateralQuantityChange = (newQuantity: any) => {
    setCollateralQuantity(newQuantity);
    updateButtonClickable(newQuantity, borrowedQuantity, liquidationPrice);
  };

  const handleBorrowedQuantityChange = (newQuantity: any) => {
    setBorrowedQuantity(newQuantity);
    updateButtonClickable(collateralQuantity, newQuantity, liquidationPrice);
  };

  const handleRowClick = (rowData: any) => {
    const newliquidationPrice = rowData["Liquidation Price"];
    setLiquidationPrice(newliquidationPrice);
    updateButtonClickable(
      collateralQuantity,
      borrowedQuantity,
      newliquidationPrice
    );
  };

  const handleButtonClick = () => {
    setMessage("Button clicked!");
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedData = showAll ? data : data.slice(0, 3);

  return (
    <div className="mt-20 ml-72 mr-4">
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
          <Typography variant="h4" color="primary" fontWeight="bold">
            My Dashboard
          </Typography>
        </Box>

        <div className="flex mt-10">
          <div className="container">
            <TabsCustom
              labels={["As Lender", "As Borrower"]}
              onClick={handleToggleClick}
            />
          </div>
        </div>
        <div className="container">
          <span className="text-success text-[12px] font-bold">{message}</span>
        </div>
      </Card>
    </div>
  );
};

export default Index;
