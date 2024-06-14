import { Box, Card, IconButton, Typography, styled } from "@mui/material";
import AmountCustom from "../../components/AmountCustom";
import { useState } from "react";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CustomButton from "../../components/CustomButton";
import TransactionSummary from "../../components/TransactionSummary";
import { formatNumber } from "../../components/GlobalFunctions";

const Index = () => {
  const oraclePrice = 4000;

  const quoteTokenName = "USDC";
  const quoteTokenWalletBalance = "11320";
  const quoteTokenRatioToUsd = 1.001;

  const baseTokenName = "WETH";
  const baseTokenWalletBalance = "15";
  const baseTokenRatioToUsd = 4005;

  const [sellTokenName, setSellTokenName] = useState<string>(baseTokenName);
  const [sellTokenWalletBalance, setSellTokenWalletBalance] = useState<string>(
    baseTokenWalletBalance
  );
  const [sellTokenRatioToUsd, setSellTokenRatioToUsd] =
    useState<number>(baseTokenRatioToUsd);
  const [buyTokenName, setBuyTokenName] = useState<string>(quoteTokenName);
  const [buyTokenRatioToUsd, setBuyTokenRatioToUsd] =
    useState<number>(quoteTokenRatioToUsd);

  const [sellAmountQuantity, setSellAmountQuantity] = useState<number>(0);
  const [buyAmountQuantity, setBuyAmountQuantity] = useState<number>(0);
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleIconButtonClick = () => {
    if (sellTokenName === baseTokenName) {
      setSellTokenName(quoteTokenName);
      setSellTokenWalletBalance(quoteTokenWalletBalance);
      setSellTokenRatioToUsd(quoteTokenRatioToUsd);
      setBuyTokenName(baseTokenName);
      setBuyTokenRatioToUsd(baseTokenRatioToUsd);
    } else {
      setSellTokenName(baseTokenName);
      setSellTokenWalletBalance(baseTokenWalletBalance);
      setSellTokenRatioToUsd(baseTokenRatioToUsd);
      setBuyTokenName(quoteTokenName);
      setBuyTokenRatioToUsd(quoteTokenRatioToUsd);
    }
    setSellAmountQuantity(0);
    setBuyAmountQuantity(0);
    setButtonClickable(false);
  };

  const transactionData = [
    {
      title: "Pay",
      value:
        sellAmountQuantity === 0 || isNaN(sellAmountQuantity)
          ? ""
          : `${formatNumber(sellAmountQuantity)} ${sellTokenName}`,
    },
    {
      title: "Receive",
      value:
        buyAmountQuantity === 0 || isNaN(buyAmountQuantity)
          ? ""
          : `${formatNumber(buyAmountQuantity)} ${buyTokenName}`,
    },
  ];

  const Rotating_IconButton = styled(IconButton)`
    transition: transform 0.4s ease;
    &:hover {
      transform: rotate(180deg);
    }
  `;

  const conversionQuantity = (
    inputTokenName: string,
    inputQty: number
  ): number => {
    if (inputTokenName === baseTokenName) {
      return inputQty * oraclePrice;
    } else {
      return inputQty / oraclePrice;
    }
  };

  const handleSellQuantityChange = (newQuantity: string) => {
    setSellAmountQuantity(parseFloat(newQuantity));
    const newBuyQty = conversionQuantity(
      sellTokenName,
      parseFloat(newQuantity)
    );
    setBuyAmountQuantity(newBuyQty);
    updateButtonClickable(parseFloat(newQuantity), newBuyQty);
  };

  const handleBuyQuantityChange = (newQuantity: string) => {
    setBuyAmountQuantity(parseFloat(newQuantity));
    const newSellQty = conversionQuantity(
      buyTokenName,
      parseFloat(newQuantity)
    );
    setSellAmountQuantity(newSellQty);
    updateButtonClickable(newSellQty, parseFloat(newQuantity));
  };

  const handleTransactionButtonClick = () => {
    setMessage("Button clicked!");
  };

  const updateButtonClickable = (sellQuantity: number, buyQuantity: number) => {
    const isClickable = sellQuantity > 0 && buyQuantity > 0;
    setButtonClickable(isClickable);
    setMessage(
      `Transaction parameters: collateralQuantity=${sellQuantity} AND borrowedQuantity=${buyQuantity} `
    );
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
          <div>
            <Typography variant="h4" color="black" fontWeight="bold">
              Trade
            </Typography>
          </div>

          <div className="flex flex-start">
            <div className="flex flex-col items-center mt-10 ">
              <div className="">
                <AmountCustom
                  title="Pay"
                  tokenWalletBalance={sellTokenWalletBalance}
                  selectedToken={sellTokenName}
                  ratioToUSD={sellTokenRatioToUsd}
                  initialQuantity={String(sellAmountQuantity)}
                  onQuantityChange={handleSellQuantityChange}
                />
              </div>
              {/* <SwapVertRoundedIcon
                className="mt-5 text-info"
                fontSize="large"
              /> */}
              <Rotating_IconButton
                aria-label="inverseSwap"
                size="large"
                className="mt-5"
                onClick={handleIconButtonClick}
              >
                <SwapVertRoundedIcon
                  fontSize="large"
                  className="text-primary"
                />
              </Rotating_IconButton>
              <div className="mt-2">
                <AmountCustom
                  title="Receive"
                  tokenWalletBalance=""
                  selectedToken={buyTokenName}
                  ratioToUSD={buyTokenRatioToUsd}
                  initialQuantity={String(buyAmountQuantity)}
                  onQuantityChange={handleBuyQuantityChange}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-10">
            <CustomButton
              clickable={buttonClickable}
              handleClick={handleTransactionButtonClick}
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
