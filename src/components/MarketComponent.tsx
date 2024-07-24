import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  TextField,
  InputAdornment,
  Typography,
  TableRow,
  Paper,
  TableProps,
  Skeleton,
} from "@mui/material";
import theme from "../theme";
import { title } from "process";
import { formatNumber } from "./GlobalFunctions";
import pairs from "../config/constants/pair.json";
import { useDataContext } from "../context/DataContext";

// Composant
export default function MarketComponent<T extends string>() {
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const { price, priceLoading, marketInfo } = useDataContext();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        padding: 0.2,
        display: "inline-block",
        backgroundColor: theme.palette.background.default,
        border: `0px solid ${theme.palette.error.main}`, //border: `1px solid ${theme.palette.background.default}`,
      }}
      className="flex flex-col"
    >
      {/* <Box
        className="mt-5"
        component={Paper}
        elevation={0} //1
        sx={{
          borderRadius: 0,
          padding: 1, //0.5, //1
          border: `2px solid ${theme.palette.common.black}`,
          backgroundColor: "inherite",
          width: "80%",
          color: "black",
        }}
      > */}
      <div className="flex flex-col items-center">
        <div className="flex font-bold">
          {selectedPair ? (
            <>
              <img
                src={selectedPair.logourlB}
                alt={selectedPair.tokenB}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "4px",
                }}
              />
              {selectedPair.tokenB} /
              <img
                src={selectedPair.logourlA}
                alt={selectedPair.tokenA}
                style={{
                  height: "20px",
                  width: "20px",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
              />
              {selectedPair.tokenA}
            </>
          ) : (
            "Select Pair"
          )}
        </div>
        <div className="flex items-center flex-grow justify-center">
          <span className={` text-[0.7rem]  `}>
            Price: 1 {marketInfo.baseTokenSymbol} ={" "}
            {priceLoading ? "Loading..." : price ? formatNumber(price) : "0"}{" "}
            {marketInfo.quoteTokenSymbol}
          </span>
        </div>
      </div>
      {/* </Box> */}
    </Paper>
  );
}
