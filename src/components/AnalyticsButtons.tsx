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
import {
  formatNumber,
  formatNumberPriceFig,
} from "../components/GlobalFunctions";
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
  userMetricBorder: string;
  userMetricBorderColor: string;
};

export default function AnalyticsButtons<T extends string | number>({
  title = "Analytics figure",
  columnsConfig,
  data,
  metrics,
  isLoading = false,
  onRowClick,
  userMetricBorder,
  userMetricBorderColor,
}: AnalyticsButtonsProps<T>) {
  const [clickedButton, setClickedButton] = useState<number | null>(null);

  const columns = columnsConfig.map((config) => config.key);

  const { price, marketInfo } = useDataContext();

  // let updatedData: RowData<T>[] = data.map((item) => {
  //   const deposits = item.deposits as number;
  //   const borrows = item.borrows as number;
  //   return {
  //     ...item, // Copie toutes les propriétés existantes
  //     total: deposits + borrows,
  //     totalDeposits: deposits,
  //     lendRatio: deposits / (deposits + borrows),
  //     borrowRatio: borrows / (deposits + borrows),
  //   };
  // });
  let updatedData: RowData<T>[] = data.map((item) => {
    const deposits = item.deposits as number;
    const borrows = item.borrows as number;
    const lendRatio = deposits != 0 ? 1 : 0;
    return {
      ...item, // Copie toutes les propriétés existantes
      totalDeposits: deposits,
      lendRatio: lendRatio, //deposits / (deposits + borrows),
      borrowRatio: borrows / deposits, //borrows / (deposits + borrows),
    };
  });
  const maxTotal = Math.max(
    ...updatedData.map((item) => item.totalDeposits as number)
  );
  const maxMyQty = Math.max(
    ...updatedData.map((item) => item[userMetricBorder] as number)
  );
  updatedData = updatedData.map((item) => {
    const total = item.totalDeposits as number;
    let total_ratio = (total / maxTotal) * 250; // 250px is the maxHeight of the box in the plot
    if (total_ratio !== 0 && total_ratio < 20) {
      // 20px is the minimum height of the box in the plot in order to be correctly visible
      total_ratio = 20;
    }

    const myQty = item[userMetricBorder] as number;
    let myQtyRatio = (myQty / maxMyQty) * 4; // 4px for the max border

    return {
      ...item, // Copie toutes les propriétés existantes
      totalRatio: total_ratio,
      myQtyRatio: myQtyRatio,
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

  console.log("updatedData , ", updatedData);

  return (
    // <Box sx={{ width: "100%" }}>
    <div>
      <span
        className="flex  text-black font-bold "
        style={{ fontSize: "140%" }}
        //style={{ backgroundColor: theme.palette.primary.main }}
      >
        {title}
      </span>
      <Box
        component={Paper}
        elevation={0} //1
        sx={{
          borderRadius: 1,
          padding: 0, //0.5, //1
          border: `0px solid ${theme.palette.background.default}`,
          backgroundColor: theme.palette.warning.main, //"white", //
          position: "relative",
          //paddingBottom: "100px",
          //paddingTop: "40px",
          //width: "100%",
        }}
      >
        <div className="flex justify-center">
          <div className="flex justify-center items-center gap-2">
            {" "}
            {/* Wrapper div to center both components */}
            <div className="container relative z-2 mt-10">
              <Box
                component={Paper}
                elevation={0} //1
                sx={{
                  borderRadius: 1,
                  padding: 0, //0.5, //1
                  border: `0px solid ${theme.palette.error.main}`,
                  backgroundColor: theme.palette.warning.main, //"white", //
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
                    const currentBuyPrice = pool.buyPrice as number;
                    const marketPrice = price as number;

                    let previousBuyPrice = updatedData[0].buyPrice as number;
                    if (poolIndex > 0) {
                      previousBuyPrice = updatedData[poolIndex - 1]
                        .buyPrice as number;
                    }
                    let goodPositionForMarketPrice_b = false;
                    let goodPositionForMarketPriceAtTheEnd_b = false;
                    if (poolIndex == 0 && marketPrice < currentBuyPrice) {
                      goodPositionForMarketPrice_b = true;
                    } else if (
                      previousBuyPrice < marketPrice &&
                      marketPrice < currentBuyPrice
                    ) {
                      goodPositionForMarketPrice_b = true;
                    } else if (
                      updatedData.length == poolIndex + 1 &&
                      currentBuyPrice < marketPrice
                    ) {
                      goodPositionForMarketPriceAtTheEnd_b = true;
                    }
                    return (
                      <div
                        className="flex"
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: "0px",
                        }}
                      >
                        {goodPositionForMarketPrice_b ? (
                          <Box
                            sx={{
                              position: "relative",
                              top: "20px",
                              width: "8px",
                              height: "300px",
                              borderRadius: 1,
                              marginLeft: 2,
                              marginRight: 2.2,
                              bgcolor: theme.palette.secondary.main,
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "100%", // Positionne le texte en dessous de l'élément principal
                                left: "-15px", // Positionne le début du texte au milieu horizontalement
                                //transform: "rotate(45deg) ", // Incline le texte et ajuste la position de son point de départ
                                //transformOrigin: "0 0", // Point d'origine de la rotation
                                whiteSpace: "nowrap", // Empêche le texte de se briser sur plusieurs lignes
                                color: theme.palette.secondary.main,
                                //fontWeight: "bold",
                                fontSize: "100%",
                              }}
                            >
                              {formatNumberPriceFig(price as number)}
                            </Box>
                          </Box>
                        ) : (
                          <div></div>
                        )}

                        <AnalyticButton
                          clickable={true} // Ajustez cette valeur selon vos besoins
                          clicked={poolIndex == clickedButton ? true : false}
                          buttonWidth={50}
                          buttonHeight={pool.totalRatio as number}
                          borderRadius={5}
                          boxLendHeightRatio={pool.lendRatio as number}
                          boxBorrowHeightRatio={pool.borrowRatio as number}
                          userBoxHeight={
                            (pool.myQtyRatio as number) > 0
                              ? (pool.myQtyRatio as number)
                              : 0
                          }
                          userBoxColor={userMetricBorderColor}
                          price={pool.buyPrice as number} // Utilisez 'price' de chaque objet
                          lendAPY={pool.lendingRate as number}
                          borrowAPY={pool.borrowingRate as number}
                          onMouseEnter={() => handleMouseEnter(pool)}
                          onMouseLeave={() => handleMouseLeave()}
                          handleClick={() => handleClick(poolIndex, pool)}
                        />
                        {goodPositionForMarketPriceAtTheEnd_b ? (
                          <Box
                            sx={{
                              position: "relative",
                              top: "20px",
                              width: "8px",
                              height: "300px",
                              borderRadius: 1,
                              marginLeft: 2,
                              marginRight: 2.2,
                              bgcolor: theme.palette.secondary.main,
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "100%", // Positionne le texte en dessous de l'élément principal
                                left: "-15px", // Positionne le début du texte au milieu horizontalement
                                //transform: "rotate(45deg) ", // Incline le texte et ajuste la position de son point de départ
                                //transformOrigin: "0 0", // Point d'origine de la rotation
                                whiteSpace: "nowrap", // Empêche le texte de se briser sur plusieurs lignes
                                color: theme.palette.secondary.main,
                                //fontWeight: "bold",
                                fontSize: "100%",
                              }}
                            >
                              {formatNumberPriceFig(price as number)}
                            </Box>
                          </Box>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Box>
            </div>
            <div
              className="flex"
              style={{
                width: "350px",
                //height: "50px"
              }}
            >
              <MetricCustom
                data={metricsData}
                isLoading={false}
                backgroundColorChosen={theme.palette.warning.main}
                displayedInColumn={true}
              />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}
