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
  isLoading?: boolean;
};

export default function AnalyticsButtons<T extends string | number>({
  title = "Analytics figure",
  columnsConfig,
  data,
  isLoading = false,
}: AnalyticsButtonsProps<T>) {
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
      totalRatio: (total / maxTotal) * 300,
    };
  });
  console.log("maxTotal", maxTotal);
  console.log("updatedData", updatedData);

  const [metricsData, setMetricsData] = useState([
    {
      title: "Buy Price",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
    },
    {
      title: "Total Lend",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
    },
    {
      title: "Total Borrow",
      value: "0",
      unit: marketInfo.quoteTokenSymbol,
    },
  ]);

  const handleMouseEnter = (
    buyPrice: number,
    deposits: number,
    borrows: number
  ) => {
    setMetricsData((prevMetricsData) => {
      return prevMetricsData.map((metric) => {
        if (metric.title === "Buy Price") {
          return { ...metric, value: buyPrice.toString() };
        } else if (metric.title === "Total Lend") {
          return { ...metric, value: deposits.toString() };
        } else if (metric.title === "Total Borrow") {
          return { ...metric, value: borrows.toString() };
        }
        return metric;
      });
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <span
        className="text-black font-bold"
        //style={{ backgroundColor: theme.palette.primary.main }}
      >
        {title}
      </span>

      <div className="flex">
        <MetricCustom data={metricsData} isLoading={false} />
      </div>
      <div className="container relative z-2 mt-10">
        <Box
          component={Paper}
          elevation={0} //1
          sx={{
            borderRadius: 1,
            padding: 0, //0.5, //1
            border: `0px solid ${theme.palette.warning.main}`,
            backgroundColor: theme.palette.background.default, //"white", //
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
                  buttonWidth={50}
                  buttonHeight={pool.totalRatio as number}
                  borderRadius={5}
                  boxLendHeightRatio={pool.lendRatio as number}
                  boxBorrowHeightRatio={pool.borrowRatio as number}
                  price={pool.buyPrice as number} // Utilisez 'price' de chaque objet
                  lendAPY={pool.lendingRate as number}
                  borrowAPY={pool.borrowingRate as number}
                  onMouseEnter={() =>
                    handleMouseEnter(
                      pool.buyPrice as number,
                      pool.deposits as number,
                      pool.borrows as number
                    )
                  }
                />
              );
            })}
          </div>
        </Box>
      </div>
    </Box>
  );
}
