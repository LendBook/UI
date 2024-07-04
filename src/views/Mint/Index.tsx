import { Box, Card, Paper, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton";
import { useMintQuoteToken } from "../../hooks/useMintQuoteToken";
import { useState } from "react";
import { useMintBaseToken } from "../../hooks/useMintBaseToken";

const Index = () => {
  const [textAfterClickQuote, setTextAfterClickQuote] = useState<string>("");
  const [textAfterClickBase, setTextAfterClickBase] = useState<string>("");

  const mintQuoteToken = useMintQuoteToken();
  const handleQuoteButtonClick = async () => {
    setTextAfterClickQuote("Transaction sent ...");
    const result = await mintQuoteToken();
    setTextAfterClickQuote(result);
  };

  const mintBaseToken = useMintBaseToken();
  const handleBaseButtonClick = async () => {
    setTextAfterClickBase("Transaction sent ...");
    const result = await mintBaseToken();
    setTextAfterClickBase(result);
  };
  return (
    <div className="mt-20 ml-72 mr-4 mb-20">
      <Card
        sx={{
          maxWidth: "1100px",
          margin: "auto",
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <div className="flex mt-10">
          <CustomButton
            clickable={true}
            handleClick={handleQuoteButtonClick}
            textClickable="Mint 1,000,000 USDC"
            textNotClickable="Must enter an amount"
            textAfterClick={textAfterClickQuote}
            buttonWidth={300}
            borderRadius={50}
          />
        </div>
        <div className="flex mt-10">
          <CustomButton
            clickable={true}
            handleClick={handleBaseButtonClick}
            textClickable="Mint 300 WETH"
            textNotClickable="Must enter an amount"
            textAfterClick={textAfterClickBase}
            buttonWidth={300}
            borderRadius={50}
          />
        </div>
      </Card>
    </div>
  );
};

export default Index;
