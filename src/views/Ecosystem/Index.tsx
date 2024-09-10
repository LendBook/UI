import { Box, Card, Paper, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton";
import { useMintQuoteToken } from "../../hooks/useMintQuoteToken";
import { useState } from "react";
import { useMintBaseToken } from "../../hooks/useMintBaseToken";
import { title } from "process";
import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";

const Index = () => {
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
        <div className="flex  flex-col mt-10">
          <div className="w-full flex mt-20">
            <span
              className="text-black font-bold"
              //style={{ backgroundColor: theme.palette.primary.main }}
            >
              LendBook Documentation :{" "}
              <a
                href="https://lendbook.github.io/lendbook-docs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://lendbook.github.io/lendbook-docs/
              </a>
            </span>
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
