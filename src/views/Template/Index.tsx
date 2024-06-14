import { Box, Card, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import AmountCustom from "../../components/AmountCustom";
import { useState } from "react";
import MetricCustom from "../../components/MetricCustom";

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

const Index = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState("");
  const [buttonClickable, setButtonClickable] = useState(false);
  const [message, setMessage] = useState("");

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
              Template
            </Typography>
            <div className="flex flex-col md-plus:flex-row space-between items-baseline">
              <div className="container" style={{ marginBottom: "10px" }}>
                Text
              </div>
            </div>

            <div className="flex mt-10">
              <CustomTable
                title="Template"
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

export default Index;
