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
            <AnalyticButton
              clickable={true}
              buttonHeight={300}
              buttonWidth={50}
              borderRadius={5}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={200}
              buttonWidth={50}
              borderRadius={5}
            />
            <AnalyticButton
              clickable={true}
              buttonHeight={240}
              buttonWidth={50}
              borderRadius={5}
            />
          </div>
        </Box>
      </div>
    </Box>
  );
}
