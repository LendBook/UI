import { Box, Card, Typography, Button } from "@mui/material";
import AmountCustom from "../AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import CustomTable from "../CustomTable";

const Index = () => {
  const [collateralQuantity, setCollateralQuantity] = useState<number>(0);
  const [borrowedQuantity, setBorrowedQuantity] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const customDataColumnsConfig = [
    { key: "liquidationPrice", title: "Liquidation Price" },
    { key: "availableSupply", title: "Available Supply" },
    { key: "borrowAPY", title: "Borrow APY" },
    { key: "utilization", title: "Utilization" },
    { key: "myBorrowingPositions", title: "My Borrowing Positions" },
  ];

  const customData = [
    {
      id: 1,
      liquidationPrice: "3,400 USDC",
      availableSupply: "10M USDC",
      borrowAPY: "10.3%",
      utilization: "95%",
      myBorrowingPositions: "",
    },
    {
      id: 2,
      liquidationPrice: "3,200 USDC",
      availableSupply: "8.2M USDC",
      borrowAPY: "7.8%",
      utilization: "90%",
      myBorrowingPositions: "7000 USDC",
    },
    {
      id: 3,
      liquidationPrice: "3,000 USDC",
      availableSupply: "8.0M USDC",
      borrowAPY: "7.0%",
      utilization: "50%",
      myBorrowingPositions: "",
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

  const handleCollateralQuantityChange = (newQuantity: any) => {
    setCollateralQuantity(newQuantity);
    updateButtonClickable(newQuantity, borrowedQuantity, liquidationPrice);
  };

  const handleBorrowedQuantityChange = (newQuantity: any) => {
    setBorrowedQuantity(newQuantity);
    updateButtonClickable(collateralQuantity, newQuantity, liquidationPrice);
  };

  const handleRowClick = (rowData: any) => {
    const newliquidationPrice = rowData.liquidationPrice;
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

  const displayedData = showAll ? customData : customData.slice(0, 3);

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
            Borrow
          </Typography>
          <div className="flex flex-col md-plus:flex-row space-between items-baseline mt-10 ">
            <div className="container" style={{ marginBottom: "10px" }}>
              <AmountCustom
                title="Collateral Amount"
                tokenWalletBalance="12.42"
                selectedToken="WETH"
                ratioToUSD={3010}
                onQuantityChange={handleCollateralQuantityChange}
              />
            </div>
            <div className="flex mt-10 md-plus:ml-10 md-plus:mt-0">
              <div className="container">
                <MetricCustom
                  data={[
                    {
                      title: "Excess collateral",
                      value: "0.125",
                      unit: "WETH",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="container" style={{ marginBottom: "10px" }}>
            <AmountCustom
              title="Borrowed Amount"
              tokenWalletBalance="376"
              selectedToken="USDC"
              ratioToUSD={1.01}
              onQuantityChange={handleBorrowedQuantityChange}
            />
          </div>

          <div className="flex mt-10">
            <CustomTable
              title="Select a Liquidation Price"
              columnsConfig={customDataColumnsConfig}
              data={displayedData}
              clickableRows={true}
              onRowClick={handleRowClick}
            />
          </div>
          <Button onClick={toggleShowAll}>
            {showAll ? "Show Less" : "Show More"}
          </Button>
          <div className="flex mt-10">
            <CustomButton
              clickable={buttonClickable}
              handleClick={handleButtonClick}
              textClickable="Finalize transaction"
              textNotClickable="Finalize transaction"
              buttonWidth={300}
              borderRadius={50}
            />
          </div>
          <div className="container">
            <span className="text-success text-[12px] font-bold">
              {message}
            </span>
          </div>

          <div className="flex mt-10"></div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
