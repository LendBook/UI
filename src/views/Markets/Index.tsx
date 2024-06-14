import { Box, Card, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import AmountCustom from "../../components/AmountCustom";
import { useState } from "react";
import MetricCustom from "../../components/MetricCustom";
import { Index } from "viem";

const templateDataTableColumnsConfig = [
  { key: "asset", title: "Asset" },
  { key: "collateral", title: "Collateral" },
  { key: "supply", title: "Supply", metric: "$" },
  { key: "apy", title: "APY", metric: "%" },
  { key: "network", title: "Network" },
];

const templateDataTable = [
  {
    id: 1,
    asset: "USDC",
    collateral: "ETH",
    network: "Sepolia tesnet",
    apy: 3.1,
    supply: 11000000,
  },
  {
    id: 2,
    asset: "ETH",
    collateral: "stETH",
    network: "Sepolia tesnet",
    apy: 2.1,
    supply: 5200000,
  },
];

const Markets = () => {
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
              Isolated markets
            </Typography>

            <div className="flex mt-10">
              <CustomTable
                title="List of available isolated markets"
                columnsConfig={templateDataTableColumnsConfig}
                data={templateDataTable}
                clickableRows={true}
              />
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Markets;
