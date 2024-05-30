import { Box, Card, Typography, Button } from "@mui/material";
import CustomTable from "../CustomTable";
import AmountCustom from "../AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import { useFetchLendOrder } from "../../hooks/useFetchLendOrder";
import { orderbookContract } from "../../contracts";
import { useFetchUserInfo } from "../../hooks/useFetchUserInfo";
import { ethers } from "ethers";

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

  const { userInfo, loadingUser, errorUser } = useFetchUserInfo(
    provider,
    walletAddress
  );
  const { data, loading, error } = useFetchLendOrder(
    orderbookContract,
    [1111111110, 1111111108, 1111111106]
  );
  const dataColumnsConfig = [
    { key: "buyPrice", title: "Buy Price" },
    { key: "totalSupply", title: "Total Supply" },
    { key: "netAPY", title: "Net APY" },
    { key: "utilization", title: "Utilization" },
    { key: "mySupply", title: "My Supply" },
  ];

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

  const handleQuantityChange = (newQuantity: any) => {
    setSupplyAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice, poolId);
  };

  const handleRowClick = (rowData: any) => {
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    const newPoolId = rowData.id;
    setPoolId(newPoolId);
    updateButtonClickable(supplyAmountQuantity, newBuyPrice, newPoolId);
  };

  const handleButtonClick = () => {
    setMessage("Button clicked!");
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  const displayedData = data; //showAll ? data : data.slice(0, 3);

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
                      value: userInfo.totalDepositsWithQuote,
                      unit: "USDC",
                    },
                  ]}
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
        </Box>
      </Card>
    </div>
  );
};

export default Index;
