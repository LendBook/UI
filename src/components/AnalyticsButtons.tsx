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

type RowData<T extends string | number> = Record<T, string | number> & {
  id: number;
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

  return (
    <Box sx={{ width: "100%" }}>
      <span
        className="text-black font-bold"
        //style={{ backgroundColor: theme.palette.primary.main }}
      >
        {title}
      </span>
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
            {/* {data.map((pool, poolIndex) => {
              return (
                <AnalyticButton
                  clickable={true} // Ajustez cette valeur selon vos besoins
                  buttonHeight={20}
                  buttonWidth={50}
                  borderRadius={5}
                  price={pool.buyPrice} // Utilisez 'price' de chaque objet
                  lendAPY={"4"}
                  borrowAPY={"3.8"}
                />
              );
            })} */}
            <AnalyticButton
              clickable={true}
              buttonHeight={20}
              buttonWidth={50}
              borderRadius={5}
              price={2000}
              lendAPY={""}
              borrowAPY={"3.8"}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={50}
              buttonWidth={50}
              boxLendHeightRatio={1}
              boxBorrowHeightRatio={0}
              borderRadius={5}
              price={2800}
              lendAPY={"0%"}
              borrowAPY={"3.8"}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={300}
              buttonWidth={50}
              boxLendHeightRatio={0.6}
              boxBorrowHeightRatio={0.4}
              borderRadius={5}
              userBoxHeight={4}
              price={3000}
              lendAPY={"4.2%"}
              borrowAPY={"3.8"}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={200}
              buttonWidth={50}
              boxLendHeightRatio={0.8}
              boxBorrowHeightRatio={0.2}
              borderRadius={5}
              price={3200}
              lendAPY={"4.2%"}
              borrowAPY={"3.8"}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={240}
              buttonWidth={50}
              boxLendHeightRatio={0.9}
              boxBorrowHeightRatio={0.1}
              borderRadius={5}
              userBoxHeight={10}
              price={3400}
              lendAPY={"3.8%"}
              borrowAPY={"3.8"}
            />
          </div>
        </Box>
      </div>
    </Box>
  );
}
