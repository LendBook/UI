import { Box, Card, Paper, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import AmountCustom from "../../components/AmountCustom";
import { useState } from "react";
import MetricCustom from "../../components/MetricCustom";
import { Index } from "viem";
import { Link, LinkProps } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    collateral: "WETH",
    network: "Sepolia tesnet",
    apy: 3.1,
    supply: 11000000,
  },
  // {
  //   id: 2,
  //   asset: "ETH",
  //   collateral: "stETH",
  //   network: "Sepolia tesnet",
  //   apy: 2.1,
  //   supply: 5200000,
  // },
];

// const handleRowClick = (rowData: any): LinkProps => ({
//   component = { Link },
//   to: "/lend",
//   onClick: () => {
//     // Ajoutez ici d'autres traitements si nécessaire avant la navigation
//   },
// });

const Markets = () => {
  const navigate = useNavigate(); // ou useNavigate() si tu utilises React Router 6

  const handleRowClick = (rowData: any) => {
    // Utilisation de history pour naviguer vers une autre route
    navigate("/lend");
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
            <Typography variant="h4" color="black">
              Isolated markets
            </Typography>
            <div className="flex mt-5"></div>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 1,
                padding: 1,
                display: "inline-block",
                width: "100%",
                //backgroundColor: theme.palette.background.default,
              }}
              className="flex flex-col"
            >
              <CustomTable
                title="List of available markets"
                columnsConfig={templateDataTableColumnsConfig}
                data={templateDataTable}
                clickableRows={true}
                onRowClick={handleRowClick}
              />
            </Paper>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Markets;
