import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TradeModule from "../Trade/TradeModule";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useState } from "react";
import MetricCustom from "../MetricCustom";
import CustomButton from "../CustomButton";
import TabsCustom from "../TabsCustom";

const dataTable = [
  {
    "Buy Price": "3,400 USDC",
    "Total Supply": "10M USDC",
    "Net APY": "10.3%",
    Utilization: "85%",
    "My Supply": "",
  },
  {
    "Buy Price": "3,200 USDC",
    "Total Supply": "8.2M USDC",
    "Net APY": "7.8%",
    Utilization: "76%",
    "My Supply": "7,000 USDC",
  },
  {
    "Buy Price": "3,000 USDC",
    "Total Supply": "3.3M USDC",
    "Net APY": "6.1%",
    Utilization: "60%",
    "My Supply": "3,000 USDC",
  },
];

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
            <div className=" text-primary text-[48px] font-bold">
              Inaki Test
            </div>

            <div className="flex mt-10">
              <div className="container">
                <TableCustom
                  title="Template table"
                  data={dataTable}
                  clickableRows={false}
                />
              </div>
            </div>

            <div className="flex mt-10">
              <div className="container">
                <TabsCustom labels={["As Lender", "As Borrower"]} />
              </div>
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
