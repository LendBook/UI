import { Box, Card, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { formatNumber } from "../GlobalFunctions";
import { useFetchLendOrder } from "../../hooks/useFetchLendOrder";
import { orderbookContract } from "../../contracts";

const dataset = [
  {
    poolId: 999,
    limitPrice: 4000,
    deposits: 10000,
    borrows: 7000,
  },
  {
    poolId: 997,
    limitPrice: 3800,
    deposits: 10000,
    borrows: 7000,
  },
  {
    poolId: 995,
    limitPrice: 3600,
    deposits: 20000,
    borrows: 7000,
  },
];
// Trier le dataset par ordre croissant de limitPrice
const sortedDataset = dataset.sort((a, b) => a.limitPrice - b.limitPrice);

const valueFormatter = (value: number | null) =>
  `$${formatNumber(String(value))}`;

const chartSetting = {
  // yAxis: [
  //   {
  //     min: 0,
  //     //max: 60000,
  //     tickLabel: null,
  //   },
  // ],
  width: 1000,
  height: 300,
  // sx: {
  //   [`.${axisClasses.left} .${axisClasses.label}`]: {
  //     transform: "translate(-20px, 0)",
  //   },
  // },
};

const Index = () => {
  const { data, loading, error } = useFetchLendOrder([
    1111111110, 1111111108, 1111111106,
  ]);
  const dataColumnsConfig = [
    { key: "buyPrice", title: "Buy Price", metric: "USDC" },
    { key: "deposits", title: "Total Supply", metric: "USDC" },
    { key: "netAPY", title: "Net APY", metric: "%" },
    { key: "utilization", title: "Utilization", metric: "%" },
    { key: "mySupply", title: "My Supply", metric: "USDC" },
  ];

  const sortedData = data.sort((a, b) => a.buyPrice - b.buyPrice);

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
              Analytics
            </Typography>
            {/* <div className="flex mt-10">
              <BarChart
                dataset={sortedDataset}
                xAxis={[{ scaleType: "band", dataKey: "limitPrice" }]}
                series={[
                  {
                    dataKey: "deposits",
                    label: "Deposits",
                    valueFormatter,
                  },
                  {
                    dataKey: "borrows",
                    label: "Borrows",
                    valueFormatter,
                  },
                ]}
                {...chartSetting}
              />
            </div> */}

            <div className="flex mt-10">
              <BarChart
                dataset={sortedData}
                xAxis={[{ scaleType: "band", dataKey: "buyPrice" }]}
                tooltip={{ trigger: "axis" }}
                series={[
                  {
                    dataKey: "deposits",
                    label: "Total Supply",
                    valueFormatter,
                  },
                  {
                    dataKey: "availableSupply",
                    label: "Available Supply",
                    valueFormatter,
                  },
                  {
                    dataKey: "borrows",
                    label: "Total Borrow",
                    valueFormatter,
                  },
                ]}
                {...chartSetting}
              />
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
