import { Box, Card, Typography, Button, Skeleton } from "@mui/material";
import AmountCustom from "../../components/AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../../components/MetricCustom";
import CustomButton from "../../components/CustomButton";
import CustomTable from "../../components/CustomTable";
import { ethers } from "ethers";
import { useFetchLendOrder } from "../../hooks/api/lend";
import { useFetchUserInfo } from "../../hooks/api/userInfo";
import { mergeObjects } from "../../components/GlobalFunctions";
import { useFetchPriceForEmptyPools } from "../../hooks/api/emptyPools";
import { useBorrow } from "../../hooks/useBorrow";
import { useDepositInCollateralAccount } from "../../hooks/UseDepositInCollateralAccount";
import { useDataContext } from "../../context/DataContext";
import { error } from "console";

const Index = () => {
  const [collateralQuantity, setCollateralQuantity] = useState<number>(0);
  const [borrowedQuantity, setBorrowedQuantity] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");

  //API

  const {
    userInfo,
    userDeposits,
    loadingUser,
    pricePoolId,
    pricePoolIdLoading,
    pricePoolIdError,
    orderData,
    orderLoading,
    orderError,
    orderMergedData,
  } = useDataContext();

  // const { pricePoolId, pricePoolIdLoading, pricePoolIdError } =
  //   useFetchPriceForEmptyPools();

  // const poolIds = pricePoolId.map((item) => item.poolId);
  // console.log(`poolIds : ${poolIds}`);
  // // const { data, loading, error } = useFetchLendOrder([
  // //   1111111110, 1111111108, 1111111106,
  // // ]); // useFetchLendOrder(poolIds); TODO mettre ça a la place quand on n'a plus de prblm d'api
  // const { data, loading, error } = useFetchLendOrder(poolIds);

  const customDataColumnsConfig = [
    { key: "buyPrice", title: "Liquidation Price", metric: "USDC" },
    { key: "deposits", title: "Total Supply", metric: "USDC" },
    { key: "availableSupply", title: "Available Supply", metric: "USDC" },
    { key: "borrowingRate", title: "Borrow APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    {
      key: "myBorrowingPositions",
      title: "My Borrowing Positions",
      metric: "USDC",
    },
  ];

  // let mergedData = mergeObjects(lendOrderData, userBorrows);
  // mergedData = mergeObjects(mergedData, pricePoolId);

  const displayedData = showAll ? orderMergedData : orderMergedData.slice(0, 3);

  // useEffect(() => {
  //   const initProvider = () => {
  //     if (window.ethereum) {
  //       const providerTemp = new ethers.providers.Web3Provider(window.ethereum);
  //       setProvider(providerTemp);
  //       providerTemp
  //         .getSigner()
  //         .getAddress()
  //         .then(setWalletAddress)
  //         .catch(console.error);
  //     } else {
  //       console.error("Please install MetaMask!");
  //     }
  //   };

  //   initProvider();
  // }, []);

  // useEffect(() => {
  //   if (!loading && !error && data) {
  //     console.log("Fetched data:", data);
  //   }
  // }, [data, loading, error]);

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
    const newliquidationPrice = rowData.buyPrice;
    setLiquidationPrice(newliquidationPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    updateButtonClickable(
      collateralQuantity,
      borrowedQuantity,
      newliquidationPrice
    );
  };

  const borrow = useBorrow();
  const depositInCollateralAccount = useDepositInCollateralAccount();

  const handleButtonClick = async () => {
    setMessage("Button clicked!");
    if (collateralQuantity == 0) {
      await borrow(Number(poolId), String(borrowedQuantity));
    } else {
      await depositInCollateralAccount(String(collateralQuantity));
      await borrow(Number(poolId), String(borrowedQuantity));
    }
  };
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

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
          <Typography variant="h4" color="black" fontWeight="bold">
            Borrow
          </Typography>
          <div>
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
                        value: userInfo.excessCollateral,
                        unit: "WETH",
                      },
                    ]}
                    isLoading={loadingUser}
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
          </div>

          <div className="flex mt-10">
            <CustomTable
              title="Select a Liquidation Price"
              columnsConfig={customDataColumnsConfig}
              data={displayedData}
              clickableRows={true}
              onRowClick={handleRowClick}
              isLoading={orderLoading}
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
          {/*<div>
            {Object.entries(userBorrows).map(([key, value]) => (
              <div key={key}>
                <h3>{key}</h3>
                <p>orderId: {value.orderId}</p>
                <p>poolId: {value.poolId}</p>
                <p>borrower: {value.borrower}</p>
                <p>quantity: {value.myBorrowingPositions}</p>
              </div>
            ))}
          </div>*/}
        </Box>
      </Card>
    </div>
  );
};

export default Index;
