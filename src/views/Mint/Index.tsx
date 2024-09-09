import { Box, Card, Paper, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton";
import { useMintQuoteToken } from "../../hooks/useMintQuoteToken";
import { useState } from "react";
import { useMintBaseToken } from "../../hooks/useMintBaseToken";
import { title } from "process";
import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";

const Index = () => {
  const { marketInfo } = useDataContext();
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
        <div className="flex flex-col mt-10">
          <span
            className="text-black font-bold"
            //style={{ backgroundColor: theme.palette.primary.main }}
          >
            To test LendBook, you need to mint some{" "}
            {marketInfo.quoteTokenSymbol} (
            <a
              href="https://sepolia.etherscan.io/address/0xb1aea92d4bf0bfbc2c5ba679a2819efefc998ceb"
              target="_blank"
              rel="noopener noreferrer"
            >
              0xb1aea92d4bf0bfbc2c5ba679a2819efefc998ceb
            </a>
            ) :<br></br>
          </span>
          <div className="w-full flex mt-5">
            <CustomButton
              clickable={true}
              handleClick={handleQuoteButtonClick}
              textClickable={`Mint 1,000,000 ${marketInfo.quoteTokenSymbol}`}
              textNotClickable="Must enter an amount"
              textAfterClick={textAfterClickQuote}
              buttonWidth={300}
              borderRadius={50}
            />
          </div>
        </div>
        <div className="flex  flex-col mt-10">
          <span
            className="text-black font-bold"
            //style={{ backgroundColor: theme.palette.primary.main }}
          >
            And you need to mint some {marketInfo.baseTokenSymbol} (
            <a
              href="https://sepolia.etherscan.io/address/0x25b8e42bdFC4cf8268B56B049d5C730762035407"
              target="_blank"
              rel="noopener noreferrer"
            >
              0x25b8e42bdFC4cf8268B56B049d5C730762035407
            </a>
            ) :<br></br>
          </span>
          <div className="w-full flex mt-5">
            <CustomButton
              clickable={true}
              handleClick={handleBaseButtonClick}
              textClickable={`Mint 300 ${marketInfo.baseTokenSymbol}`}
              textNotClickable="Must enter an amount"
              textAfterClick={textAfterClickBase}
              buttonWidth={300}
              borderRadius={50}
            />
          </div>

          <div className="w-full flex mt-20">
            <span
              className="text-black font-bold"
              //style={{ backgroundColor: theme.palette.primary.main }}
            >
              LendBook contract :{" "}
              <a
                href="https://sepolia.etherscan.io/address/0x5b0D0DDB7860eaEed42AE95b05A7d2df9877aD25"
                target="_blank"
                rel="noopener noreferrer"
              >
                0x5b0D0DDB7860eaEed42AE95b05A7d2df9877aD25
              </a>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
