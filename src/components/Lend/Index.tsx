import { Box, Card, Typography, Button } from "@mui/material";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useEffect, useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import { useFetchLendOrder } from "../../hooks/fetchLendOrder";
import { orderbookContract } from "../../contracts";

const Index = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const { data, loading, error } = useFetchLendOrder(orderbookContract, [1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    if (!loading && !error && data) {
      console.log('Fetched data:', data);
    }
  }, [data, loading, error]);

  const updateButtonClickable = (quantity: number, price: string) => {
    const isClickable = quantity > 0 && price !== "";
    setButtonClickable(isClickable);
    setMessage(`Transaction parameters: supply=${quantity} AND buy price=${price}`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setSupplyAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice);
  };

  const handleRowClick = (rowData: any) => {
    const newBuyPrice = rowData.buyPrice;
    setBuyPrice(newBuyPrice);
    updateButtonClickable(supplyAmountQuantity, newBuyPrice);
  };

  const handleButtonClick = () => {
    setMessage("Button clicked!");
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  const displayedData = showAll ? data : data.slice(0, 3);

  return (
      <div className="mt-20 ml-72 mr-4">
        <Card sx={{ maxWidth: "1100px", margin: "auto", background: "transparent", boxShadow: "none", border: "none" }}>
          <Box>
            <Typography variant="h4" color="primary">Lend to Earn</Typography>
            <AmountCustom
                title="Supply Amount"
                tokenWalletBalance="11320"
                selectedToken="USDC"
                ratioToUSD={1.01}
               // onQuantityChange={handleQuantityChange}
            />
            <MetricCustom data={[{ title: "My amount already supplied", value: "10000", unit: "USDC" }]} />
            <TableCustom
                title="Select a Buy Price"
                data={displayedData}
                clickableRows={true}
                onRowClick={handleRowClick}
            />
            <CustomButton
                clickable={buttonClickable}
                handleClick={handleButtonClick}
                textClickable="Finalize transaction"
                textNotClickable="Finalize transaction"
                buttonWidth={300}
                borderRadius={50}
            />
            <Button onClick={toggleShowAll}>{showAll ? "Show Less" : "Show More"}</Button>
            <Typography>{message}</Typography>
          </Box>
        </Card>
      </div>
  );
};

export default Index;
