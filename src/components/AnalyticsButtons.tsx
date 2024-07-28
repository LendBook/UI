import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "../theme";
import { formatNumber } from "../components/GlobalFunctions";
import { Skeleton } from "@mui/material";
import CustomButton from "./CustomButton";
import AnalyticButton from "./AnalyticButton";
import MetricCustom from "./MetricCustom";
import { userInfo } from "os";
import { useDataContext } from "../context/DataContext";
import { title } from "process";

type RowData<T extends string | number> = Record<T, string | number> & {
  id: number;
  [key: string]: string | number;
};

type AnalyticsButtonsProps<T extends string | number> = {
  title?: string;
  columnsConfig: {
    key: T;
    title: string;
    metric?: string;
    isButton?: boolean;
    onButtonClick?: (id: number) => void;
  }[];
  data: RowData<T>[]; //data object needs to have at least "id" as one of his key
  metrics: {
    key: string;
    title: string;
    value: string;
    unit: string;
    color: string;
  }[];
  isLoading?: boolean;
  onRowClick?: (row: RowData<T>) => void;
};

export default function AnalyticsButtons<T extends string | number>({
  title = "Analytics figure",
  columnsConfig,
  data,
  metrics,
  isLoading = false,
  onRowClick,
}: AnalyticsButtonsProps<T>) {
  const [clickedButton, setClickedButton] = useState<number | null>(null);

  const columns = columnsConfig.map((config) => config.key);

  const { marketInfo } = useDataContext();

  let updatedData: RowData<T>[] = data.map((item) => {
    const deposits = item.deposits as number;
    const borrows = item.borrows as number;
    return {
      ...item, // Copie toutes les propriétés existantes
      total: deposits + borrows,
      lendRatio: deposits / (deposits + borrows), // Ajoute une nouvelle propriété 'sum'
      borrowRatio: borrows / (deposits + borrows), // Ajoute une nouvelle propriété 'sum'
    };
  });
  const maxTotal = Math.max(...updatedData.map((item) => item.total as number));
  updatedData = updatedData.map((item) => {
    const total = item.total as number;
    return {
      ...item, // Copie toutes les propriétés existantes
      totalRatio: (total / maxTotal) * 250,
    };
  });
  console.log("maxTotal", maxTotal);
  console.log("updatedData", updatedData);

  const [metricsData, setMetricsData] = useState(metrics);

  const [metricsDataClicked, setMetricsDataClicked] = useState(metricsData);
  const handleMouseEnter = (row: RowData<T>) => {
    setMetricsData((prevMetricsData) => {
      // Obtenir toutes les clés uniques de prevMetricsData
      const keysToUpdate: { [key: string]: boolean } = {};
      prevMetricsData.forEach((metric) => {
        keysToUpdate[metric.key] = true;
      });

      return prevMetricsData.map((metric) => {
        if (keysToUpdate[metric.key] && row.hasOwnProperty(metric.key)) {
          return { ...metric, value: row[metric.key].toString() };
        }
        return metric;
      });
    });
  };

  const handleMouseLeave = () => {
    setMetricsData(metricsDataClicked);
  };

  const handleClick = (poolIndex: number, row: RowData<T>) => {
    if (onRowClick) {
      onRowClick(row);
    }

    setClickedButton(poolIndex);
    console.log(data);
    setMetricsDataClicked((prevMetricsData) => {
      // Obtenir toutes les clés uniques de prevMetricsData
      const keysToUpdate: { [key: string]: boolean } = {};
      prevMetricsData.forEach((metric) => {
        keysToUpdate[metric.key] = true;
      });

      return prevMetricsData.map((metric) => {
        if (keysToUpdate[metric.key] && row.hasOwnProperty(metric.key)) {
          return { ...metric, value: row[metric.key].toString() };
        }
        return metric;
      });
    });
  };

  const buyPriceMetric = metricsData.find(
    (metric) => metric.title === "Buy Price"
  );
  const buyPrice = buyPriceMetric?.value || "default value";

  return (
    <Box sx={{ width: "100%" }}>
      <span
        className="flex justify-center text-black font-bold"
        //style={{ backgroundColor: theme.palette.primary.main }}
      >
        {title}
      </span>
      <div className="flex">
        <div className="container relative z-2 mt-10">
          <Box
            component={Paper}
            elevation={0} //1
            sx={{
              borderRadius: 1,
              padding: 0, //0.5, //1
              border: `0px solid ${theme.palette.warning.main}`,
              //backgroundColor: theme.palette.background.default, //"white", //
              position: "relative",
              paddingBottom: "100px",
              paddingTop: "40px",
            }}
          >
            <div
              className="flex"
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {updatedData.map((pool, poolIndex) => {
                return (
                  <AnalyticButton
                    clickable={true} // Ajustez cette valeur selon vos besoins
                    clicked={poolIndex == clickedButton ? true : false}
                    buttonWidth={50}
                    buttonHeight={pool.totalRatio as number}
                    borderRadius={5}
                    boxLendHeightRatio={pool.lendRatio as number}
                    boxBorrowHeightRatio={pool.borrowRatio as number}
                    userBoxHeight={(pool.mySupply as number) > 0 ? 6 : 0}
                    userBoxColor={theme.palette.primary.main}
                    price={pool.buyPrice as number} // Utilisez 'price' de chaque objet
                    lendAPY={pool.lendingRate as number}
                    borrowAPY={pool.borrowingRate as number}
                    onMouseEnter={() => handleMouseEnter(pool)}
                    onMouseLeave={() => handleMouseLeave()}
                    handleClick={() => handleClick(poolIndex, pool)}
                  />
                );
              })}
            </div>
          </Box>
        </div>
        <div className="flex" style={{ width: "300px", height: "50px" }}>
          {buyPrice != "0" ? (
            <MetricCustom
              data={metricsData}
              isLoading={false}
              backgroundColorChosen={"white"}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </Box>
  );
}
