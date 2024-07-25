import { Box, Card, Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "../../components/GlobalFunctions";
import { useDataContext } from "../../context/DataContext";

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
  const { orderMergedData } = useDataContext();

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
              Inaki test
            </Typography>
            <div className="flex mt-10">
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
            </div>

            <div className="flex mt-5">
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 1,
                  padding: 1,
                  display: "inline-block",
                  //backgroundColor: theme.palette.background.default,
                }}
                className="flex flex-col"
              >
                <BarChart
                  dataset={orderMergedData}
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
              </Paper>
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
