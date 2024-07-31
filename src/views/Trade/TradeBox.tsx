import {
  Box,
  Card,
  IconButton,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import AmountCustom from "../../components/AmountCustom";
import { useState } from "react";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CustomButton from "../../components/CustomButton";
import TransactionSummary from "../../components/TransactionSummary";
import { formatNumber } from "../../components/GlobalFunctions";
import theme from "../../theme";
import { useApproveQuoteToken } from "../../hooks/useApproveQuoteToken";
import { useApproveBaseToken } from "../../hooks/useApproveBaseToken";
import { useTakeBaseTokens } from "../../hooks/UseTakeBaseTokens";
import { useTakeQuoteTokens } from "../../hooks/UseTakeQuoteTokens";
import { useDataContext } from "../../context/DataContext";

// Définition des types pour les props de AmountCustom
type TradeBoxProps = {
  poolId: string;
  sellToken: string;
  sellTokenName: string;
  sellTokenRatioToUsd: number;
  buyTokenName: string;
  buyTokenRatioToUsd: number;
  buyTokenMaxSupply: number;
  sellTokenMaxSupply: number;
  buyPrice: number;
};

export default function TradeBox({
  poolId,
  sellToken,
  sellTokenName,
  sellTokenRatioToUsd,
  buyTokenName,
  buyTokenRatioToUsd,
  buyTokenMaxSupply,
  sellTokenMaxSupply,
  buyPrice,
}: TradeBoxProps) {
  const [sellAmountQuantity, setSellAmountQuantity] = useState<number>(0);
  const [buyAmountQuantity, setBuyAmountQuantity] = useState<number>(0);
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [textAfterClick, setTextAfterClick] = useState<string>("");

  const { refetchData } = useDataContext();

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

  const handleSellQuantityChange = (newQuantity: string) => {
    setSellAmountQuantity(parseFloat(newQuantity));
    const newBuyQty = parseFloat(newQuantity) * buyPrice;
    setBuyAmountQuantity(newBuyQty);
    updateButtonClickable(parseFloat(newQuantity), newBuyQty);
  };

  const handleBuyQuantityChange = (newQuantity: string) => {
    setBuyAmountQuantity(parseFloat(newQuantity));
    const newSellQty = parseFloat(newQuantity) / buyPrice;
    setSellAmountQuantity(newSellQty);
    updateButtonClickable(newSellQty, parseFloat(newQuantity));
  };

  const approveBaseToken = useApproveBaseToken();
  const approveQuoteToken = useApproveQuoteToken();
  const takeBaseTokens = useTakeBaseTokens();
  const takeQuoteTokens = useTakeQuoteTokens();

  const handleTransactionButtonClick = async () => {
    if (buttonClickable) {
      setTextAfterClick("Transaction approval sent ...");

      if (sellToken == "Base") {
        const resultApproval = await approveBaseToken(
          String(sellAmountQuantity)
        );
        setTextAfterClick(resultApproval);
        setTextAfterClick("Transaction trade sent ...");
        const result = await takeQuoteTokens(
          Number(poolId),
          String(buyAmountQuantity)
        );
        setTextAfterClick(result);
        if (result == "Transaction successful!") {
          refetchData();
          // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
          refetchData();
        }
      } else if (sellToken == "Quote") {
        const resultApproval = await approveQuoteToken(
          String(sellAmountQuantity)
        );
        setTextAfterClick(resultApproval);
        setTextAfterClick("Transaction trade sent ...");
        const result = await takeBaseTokens(
          Number(poolId), //FIXEME tester pour voir si c'est pas Number(poolId)+1 qu'il faut mettre...
          String(buyAmountQuantity)
        );
        setTextAfterClick(result);
        if (result == "Transaction successful!") {
          refetchData();
          // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
          refetchData();
        }
      }
    }
  };

  const updateButtonClickable = (sellQuantity: number, buyQuantity: number) => {
    const isClickable = sellQuantity > 0 && buyQuantity > 0;
    setButtonClickable(isClickable);
    setMessage(
      `Transaction parameters: collateralQuantity=${sellQuantity} AND borrowedQuantity=${buyQuantity} `
    );
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <div className="flex mt-5"></div>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          padding: 1,
          display: "inline-block",
          border: `0px solid ${theme.palette.error.main}`, //
          //width: "100%",
          //backgroundColor: theme.palette.background.default,
        }}
        className="flex flex-col "
      >
        <div className="flex flex-start">
          <div className="flex items-center ">
            <div className="">
              <AmountCustom
                title="Pay"
                tokenWalletBalance={sellTokenMaxSupply}
                selectedToken={sellTokenName}
                ratioToUSD={sellTokenRatioToUsd}
                initialQuantity={String(sellAmountQuantity)}
                onQuantityChange={handleSellQuantityChange}
              />
            </div>

            <SwapVertRoundedIcon
              fontSize="large"
              className="text-primary ml-5"
              style={{ transform: "rotate(90deg)" }}
            />
            <div className="ml-5">
              <AmountCustom
                title="Receive"
                tokenWalletBalance={buyTokenMaxSupply}
                selectedToken={buyTokenName}
                ratioToUSD={buyTokenRatioToUsd}
                initialQuantity={String(buyAmountQuantity)}
                onQuantityChange={handleBuyQuantityChange}
              />
            </div>
          </div>
        </div>
        <div className="flex  justify-center mt-10">
          <CustomButton
            clickable={buttonClickable}
            handleClick={handleTransactionButtonClick}
            textClickable="Finalize transaction"
            textNotClickable="Must enter an amount"
            textAfterClick={textAfterClick}
            buttonWidth={300}
            borderRadius={50}
          />
        </div>
        <div className="flex  justify-center mt-5">
          <TransactionSummary data={transactionData} />
        </div>
      </Paper>
    </Box>
  );
}
