import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  TextField,
  InputAdornment,
  Typography,
  TableRow,
  Paper,
  TableProps,
} from "@mui/material";
import theme from "../theme";
import { formatNumber } from "./GlobalFunctions";

//valeur à recuperer
//price feed indiquatif in USD

// Type générique pour une ligne de données
type RowData<T extends string | number> = Record<T, string | number>;

// Définition des types pour les props de TableCustom
type MetricCustomProps<T extends string> = {
  title?: string;
  data: RowData<T>[];
};

// Composant TableCustom
export default function MetricCustom<T extends string>({
  title = "Transaction summary :",
  data,
}: MetricCustomProps<T>) {
  const allValuesEmpty = data.every((row) => {
    if ("value" in row) {
      return row.value === 0 || row.value === "";
    }
    return true;
  });

  // Si toutes les valeurs sont vides, ne rien afficher
  if (allValuesEmpty) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 1,
        padding: 1,
        display: "inline-block",
        //backgroundColor: theme.palette.error.main,
      }}
      className="flex flex-col"
    >
      <Typography
        variant="body2"
        style={{
          fontWeight: "bold",
          color: theme.palette.info.main,
        }}
      >
        {title}
      </Typography>
      <hr
        style={{
          border: "0",
          borderBottom: `1px solid ${theme.palette.info.main}`,
          margin: "5px 0px",
        }}
      />
      {data.map((row, rowIndex) => {
        const value = row["value" as keyof RowData<T>];
        const displayValue = value ? `${value}` : "must be provided";

        return (
          <Box key={rowIndex} sx={{ marginBottom: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {row["title" as keyof RowData<T>]}
              {": "}
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: 900,
                  color:
                    displayValue === "must be provided"
                      ? theme.palette.text.primary
                      : theme.palette.success.main,
                }}
              >
                {displayValue}
              </Typography>
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
}
