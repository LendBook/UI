import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import AmountCustom from "../AmountCustom";
import { useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import TabsCustom from "../TabsCustom";
import CustomTable from "../CustomTable";
import TransactionSummary from "../TransactionSummary";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const templateDataTableColumnsConfig = [
  { key: "dataA", title: "Data A" },
  { key: "dataB", title: "Data B" },
  { key: "dataC", title: "Data C" },
];

const templateDataTable = [
  {
    id: 1,
    dataA: "1000 USDC",
    dataB: "1500 USDC",
    dataC: "2500 USDC",
  },
  {
    id: 2,
    dataA: "2000 USDC",
    dataB: "2500 USDC",
    dataC: "2500 USDC",
  },
  {
    id: 3,
    dataA: "3000 USDC",
    dataB: "3500 USDC",
    dataC: "2500 USDC",
  },
];

const handleRowClick = (rowData: any) => {
  console.log(rowData);
  console.log(templateDataTable);
  const newBuyPrice = rowData.dataA;
  const newPoolId = rowData.id;
};

const seriesA = {
  data: [2, 3, 1, 4, 5],
  label: "Series A",
};
const seriesB = {
  data: [3, 1, 4, 2, 1],
  label: "Series B",
};
const seriesC = {
  data: [3, 2, 4, 5, 1],
  label: "Series C",
};
const Index = () => {
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
            <Typography variant="h3" color="black" fontWeight="bold">
              Inaki Test
            </Typography>
            <div className="flex mt-10">
              <div className="container">
                <TabsCustom labels={["As Lender", "As Borrower"]} />
              </div>
            </div>
            <div className="flex mt-10">
              <CustomTable
                title="Select a Buy Price"
                columnsConfig={templateDataTableColumnsConfig}
                data={templateDataTable}
                clickableRows={true}
                onRowClick={handleRowClick}
              />
            </div>
            <div className="flex mt-10">
              <BarChart
                width={600}
                height={300}
                series={[
                  { ...seriesA, stack: "total" },
                  { ...seriesB, stack: "total" },
                  { ...seriesC, stack: "total" },
                ]}
              />
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
