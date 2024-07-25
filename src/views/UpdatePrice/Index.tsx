import { Box, Card, Paper, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton";
import { useMintQuoteToken } from "../../hooks/useMintQuoteToken";
import { useState } from "react";
import { useMintBaseToken } from "../../hooks/useMintBaseToken";
import { title } from "process";
import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";
import AmountCustom from "../../components/AmountCustom";
import { useChangePriceFeed } from "../../hooks/useChangePriceFeed";
import { useSwitchPriceFeed } from "../../hooks/useSwitchPriceFeed";

const Index = () => {
  const [newPrice, setNewPrice] = useState<number>(0);
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  //const [textAfterClick, setTextAfterClick] = useState<string>("");

  const { userInfo, refetchData, marketInfo } = useDataContext();

  const updateButtonClickable = (_newPrice: number) => {
    const isClickable = _newPrice > 0;
    setButtonClickable(isClickable);
    //setTextAfterClick("");
  };

  const handleNewPriceChange = (newQuantity: any) => {
    setNewPrice(newQuantity);
    updateButtonClickable(newQuantity);
  };

  const changePriceFeed = useChangePriceFeed();

  const handleButtonClick = async () => {
    console.log("clicked");
    if (newPrice) {
      await changePriceFeed(newPrice.toString());
      refetchData();
      refetchData();
      refetchData();
    } else {
      console.log("Please enter a price.");
    }
  };

  const switchPriceFeed = useSwitchPriceFeed();

  const handleButtonClickSwitch = async () => {
    await switchPriceFeed();
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
            className="text-black "
            //style={{ backgroundColor: theme.palette.primary.main }}
          >
            In order to manually change the price feed, first you need to switch
            to manual price by clicking on the button. <br></br>To come back to
            chainlink price feed, you need to click on the button.
          </span>
          <CustomButton
            clickable={true}
            handleClick={handleButtonClickSwitch}
            textClickable="Switch Price Feed"
            textNotClickable=""
            textAfterClick=""
            buttonWidth={300}
            borderRadius={50}
          />

          <div className="flex flex-col mt-10">
            <AmountCustom
              title="Change price feed"
              tokenWalletBalance={0}
              selectedToken=""
              ratioToUSD={0}
              onQuantityChange={handleNewPriceChange}
            />
            <div className="flex mt-5"></div>
            <CustomButton
              clickable={buttonClickable}
              handleClick={handleButtonClick}
              textClickable="Update Price Feed"
              textNotClickable="Must enter a price first"
              textAfterClick=""
              buttonWidth={300}
              borderRadius={50}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
