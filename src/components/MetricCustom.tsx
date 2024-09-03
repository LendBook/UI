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
  Skeleton,
  Container,
} from "@mui/material";
import theme from "../theme";
import { title } from "process";
import { formatNumber } from "./GlobalFunctions";
import MarketComponent from "../components/MarketComponent";
import { menu } from "@material-tailwind/react";
import DivWithTooltip from "./DivWithTooltip";

//valeur à recuperer
//price feed indiquatif in USD

// Type générique pour une ligne de données
//type RowData<T extends string> = Record<T, string>;
// type RowData<T extends string> = {
//   [K in T]: K extends "value" ? string | string[] : string;
// };
type RowData<T extends string> = {
  [K in T]: string | string[]; // Accepte soit une chaîne unique, soit un tableau de chaînes.
};

// Définition des types pour les props de TableCustom
type MetricCustomProps<T extends string> = {
  data: RowData<T>[];
  isLoading?: boolean;
  backgroundColorChosen?: string;
  displayedInColumn?: boolean;
};

// Composant TableCustom
export default function MetricCustom<T extends string>({
  data,
  isLoading = false,
  backgroundColorChosen = "white", //theme.palette.warning.main,
  displayedInColumn = false,
}: MetricCustomProps<T>) {
  const Container = styled(Box)(({ theme }) => ({
    display: "inline-flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: displayedInColumn ? "column" : "row", //"row"
    },
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        padding: 1,
        display: "inline-block",
        border: `0px solid ${theme.palette.error.main}`,
        backgroundColor: backgroundColorChosen
          ? backgroundColorChosen
          : theme.palette.background.default,
      }}
      className="flex"
    >
      <Container>
        {data.map((row, rowIndex) => (
          <div key={rowIndex}>
            <Paper
              elevation={0}
              style={{
                borderRadius: 1,
                padding: 2,
                backgroundColor: backgroundColorChosen
                  ? backgroundColorChosen
                  : theme.palette.background.default,
              }}
              className="flex flex-col"
            >
              <div style={{ marginRight: 10 }}>
                <div className="flex">
                  <DivWithTooltip
                    tooltipText={
                      (row["tooltipText" as keyof RowData<T>] as string) ?? ""
                    }
                    iconColor={
                      (row["color" as keyof RowData<T>] as string) ||
                      theme.palette.info.main
                    }
                  >
                    {row["icon" as keyof RowData<T>] && (
                      <span
                        style={{
                          verticalAlign: "middle",
                          marginTop: "-3px",
                          marginRight: "4px",
                          color: (row["color" as keyof RowData<T>] as string)
                            ? (row["color" as keyof RowData<T>] as string)
                            : theme.palette.info.main,
                        }}
                      >
                        {row["icon" as keyof RowData<T>]}
                      </span>
                    )}
                    <Typography
                      style={{
                        fontWeight: "bold",
                        fontSize: "90%",
                        color: (row["color" as keyof RowData<T>] as string)
                          ? (row["color" as keyof RowData<T>] as string)
                          : theme.palette.info.main,
                      }}
                    >
                      {row["title" as keyof RowData<T>]}
                    </Typography>
                  </DivWithTooltip>
                </div>
                <Typography
                  variant="body1"
                  style={{
                    color: theme.palette.common.black,
                    fontWeight: "bold",
                  }}
                >
                  {isLoading ? (
                    <Skeleton variant="text" width="50%" />
                  ) : Array.isArray(row["value" as keyof RowData<T>]) ? (
                    // Affichage si value est un tableau de chaînes
                    (row["value" as keyof RowData<T>] as string[]).map(
                      (val, index) => (
                        <div
                          style={{
                            fontSize:
                              (row["fontSize" as keyof RowData<T>] as string[])[
                                index
                              ] || "100%",
                          }}
                          key={index}
                        >
                          {formatNumber(val)}{" "}
                          {Array.isArray(row["unit" as keyof RowData<T>])
                            ? (row["unit" as keyof RowData<T>] as string[])[
                                index
                              ] || ""
                            : row["unit" as keyof RowData<T>]}
                        </div>
                      )
                    )
                  ) : (
                    // Affichage si value est une chaîne unique
                    <div
                      style={{
                        fontSize:
                          (row["fontSize" as keyof RowData<T>] as string) ||
                          "100%",
                      }}
                    >
                      {formatNumber(row["value" as keyof RowData<T>] as string)}{" "}
                      {row["unit" as keyof RowData<T>]}
                    </div>
                  )}
                </Typography>
              </div>
            </Paper>
          </div>
        ))}
      </Container>
    </Paper>
  );
}
