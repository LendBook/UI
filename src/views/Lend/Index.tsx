import { Box, Card, Typography, Button, Skeleton } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import AmountCustom from "../../components/AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../../components/MetricCustom";
import CustomButton from "../../components/CustomButton";
import { useFetchLendOrder } from "../../hooks/api/lend";
import { useFetchUserInfo } from "../../hooks/api/userInfo";
import { useFetchPriceForEmptyPools } from "../../hooks/api/emptyPools";
import { ethers } from "ethers";
import TransactionSummary from "../../components/TransactionSummary";
import { formatNumber, mergeObjects } from "../../components/GlobalFunctions";

const Index = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [poolId, setPoolId] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const { userInfo, userDeposits, userBorrows, loadingUser, errorUser } =
    useFetchUserInfo(provider, walletAddress);

  const { pricePoolId, pricePoolIdLoading, pricePoolIdError } =
    useFetchPriceForEmptyPools();

  const poolIds = pricePoolId.map((item) => item.poolId);
  console.log(`poolIds : ${poolIds}`);
  const { data, loading, error } = useFetchLendOrder([
    1111111110, 1111111108, 1111111106,
  ]); // useFetchLendOrder(poolIds); TODO mettre ça a la place quand on n'a plus de prblm d'api

  const dataColumnsConfig = [
    { key: "buyPrice", title: "Buy Price", metric: "USDC" },
    { key: "deposits", title: "Total Supply", metric: "USDC" },
    { key: "lendingRate", title: "Net APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    { key: "mySupply", title: "My Supply", metric: "USDC" },
  ];

  let mergedData = mergeObjects(data, userDeposits);
  mergedData = mergeObjects(mergedData, pricePoolId);

  const displayedData = showAll ? mergedData : mergedData.slice(0, 3);

  useEffect(() => {
    const initProvider = () => {
      if (window.ethereum) {
        const providerTemp = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providerTemp);
        providerTemp
          .getSigner()
          .getAddress()
          .then(setWalletAddress)
          .catch(console.error);
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initProvider();
  }, []);

  useEffect(() => {
    if (!loading && !error && data) {
      console.log("Fetched data:", data);
    }
  }, [data, loading, error]);

  const updateButtonClickable = (
    quantity: number,
    price: string,
    poolId: string
  ) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setMessage(
      `Transaction parameters: supply=${quantity} AND buy price=${price} AND poolID=${poolId}`
    );
  };

  const handleQuantityChange = (newQuantity: string) => {
    setSupplyAmountQuantity(parseFloat(newQuantity));
    updateButtonClickable(parseFloat(newQuantity), buyPrice, poolId);
  };

  const handleRowClick = (rowData: any) => {
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    const newPoolId = rowData.poolId;
    setPoolId(newPoolId);
    updateButtonClickable(supplyAmountQuantity, newBuyPrice, newPoolId);
  };

  const handleButtonClick = () => {
    setMessage("Button clicked!");
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (error) return <Typography>Error: {error}</Typography>;

  const transactionData = [
    {
      title: "Supplied Amount",
      value:
        supplyAmountQuantity === 0 || isNaN(supplyAmountQuantity)
          ? ""
          : `${formatNumber(supplyAmountQuantity)} USDC`,
    },
    {
      title: "Selected buy price",
      value: formatNumber(buyPrice),
    },
  ];

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
            Lend to Earn
          </Typography>
          <div className="flex flex-col md-plus:flex-row space-between items-baseline mt-10 ">
            <div className="container" style={{ marginBottom: "10px" }}>
              <AmountCustom
                title="Supply Amount"
                tokenWalletBalance="11320"
                selectedToken="USDC"
                ratioToUSD={1.01}
                onQuantityChange={handleQuantityChange}
              />
            </div>
            <div className="flex mt-10 md-plus:ml-10 md-plus:mt-0">
              <div className="container">
                <MetricCustom
                  data={[
                    {
                      title: "My amount already supplied",
                      value: userInfo.totalDepositsQuote,
                      unit: "USDC",
                    },
                  ]}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-10">
            <CustomTable
              title="Select a Buy Price"
              columnsConfig={dataColumnsConfig}
              data={displayedData}
              clickableRows={true}
              onRowClick={handleRowClick}
              isLoading={loading}
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
          <div className="flex mt-5">
            <TransactionSummary data={transactionData} />
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
