import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "../../components/GlobalFunctions";
import { useDataContext } from "../../context/DataContext";
import { useState } from "react";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import AnalyticsButtons from "../../components/AnalyticsButtons";

const valueFormatter = (value: number | null) =>
  `$${formatNumber(String(value))}`;

const Index = () => {
  // const { data, loading, error } = useFetchLendOrder([
  //   1111111110, 1111111108, 1111111106,
  // ]);
  const [fixMargin, setFixMargin] = useState(true);
  const [fixLabel, setFixLabel] = useState(true);

  // const sortedData = data.sort((a, b) => a.buyPrice - b.buyPrice);

  const { orderMergedData, poolLoading, marketInfo } = useDataContext();

  let sortedData = [...orderMergedData];
  sortedData.sort((a, b) => Number(a.buyPrice) - Number(b.buyPrice));

  sortedData = sortedData.map((item) => {
    return {
      ...item,
      buyPrice: formatNumber(item.buyPrice).toString(),
    };
  });

  const customDataColumnsConfig = [
    {
      key: "buyPrice",
      title: "Liquidation Price",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "deposits",
      title: "Total Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
    {
      key: "availableSupply",
      title: "Available Supply",
      metric: marketInfo.quoteTokenSymbol,
    },
    { key: "borrowingRate", title: "Borrow APY", metric: "%" },
    { key: "utilizationRate", title: "Utilization", metric: "%" },
    {
      key: "myBorrowingPositions",
      title: "My Borrowing Positions",
      metric: marketInfo.quoteTokenSymbol,
    },
  ];

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
              Analytics
            </Typography>
            <div className="flex mt-20 mb-20">
              <AnalyticsButtons
                title="Analytics via button!"
                columnsConfig={customDataColumnsConfig}
                data={sortedData}
                isLoading={poolLoading}
              />
            </div>
            <div className="flex mt-5 mb-5">
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
                <Box sx={{ width: "100%" }}>
                  <BarChart
                    dataset={sortedData}
                    sx={{
                      [`.${axisClasses.left} .${axisClasses.label}`]: {
                        // Move the y-axis label with CSS
                        transform: "translateX(-35px)",
                      },
                    }}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "buyPrice",
                        label: `Limit prices of pools of orders (${marketInfo.quoteTokenSymbol})`,
                        labelStyle: {
                          fontSize: 14,
                          transform: "translateY(30px)", // Décaler le label de l'axe X vers le bas
                        },
                        tickLabelStyle: {
                          angle: 45, //-45
                          textAnchor: "start", //"end"
                          fontSize: 12,
                        },
                      },
                    ]}
                    yAxis={[
                      {
                        label: `Amount (${marketInfo.quoteTokenSymbol})`,
                        labelStyle: {
                          fontSize: 14,
                        },
                      },
                    ]}
                    width={1000}
                    height={400}
                    margin={{ top: 40, right: 5, bottom: 80, left: 100 }}
                    tooltip={{ trigger: "axis" }}
                    series={[
                      {
                        dataKey: "deposits",
                        label: "Total supply per pool",
                        valueFormatter,
                      },
                      {
                        dataKey: "borrows",
                        label: "Total borrow per pool",
                        valueFormatter,
                      },
                    ]}
                  />
                </Box>
              </Paper>
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
