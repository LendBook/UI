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

//valeur à recuperer
//price feed indiquatif in USD

// Type générique pour une ligne de données
type RowData<T extends string> = Record<T, string>;

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
  backgroundColorChosen = theme.palette.warning.main,
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
        padding: 0, //1
        display: "inline-block",
        border: `0px solid ${theme.palette.error.main}`, //border: `1px solid ${theme.palette.background.default}`,
        backgroundColor: backgroundColorChosen
          ? backgroundColorChosen
          : theme.palette.background.default,
      }}
      className="flex"
    >
      <Container>
        {/* <MarketComponent /> */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex} //className="min-w-[300px]"
          >
            <Paper
              elevation={0}
              style={{
                borderRadius: 1,
                padding: 2,
                backgroundColor: backgroundColorChosen
                  ? backgroundColorChosen
                  : theme.palette.background.default,
                //marginRight: rowIndex !== data.length - 1 ? 10 : 0,
                //marginBottom: rowIndex !== data.length - 1 ? 10 : 0,
                //width: "100px",
              }}
              className="flex flex-col"
            >
              <div
                style={{
                  //marginLeft: 10
                  marginRight: 10,
                }}
              >
                <div className="flex">
                  {row["icon" as keyof RowData<T>] && (
                    <span
                      style={{
                        verticalAlign: "middle",
                        marginTop: "-3px",
                        marginRight: "4px",
                        color: row["color" as keyof RowData<T>]
                          ? row["color" as keyof RowData<T>]
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
                      color: row["color" as keyof RowData<T>]
                        ? row["color" as keyof RowData<T>]
                        : theme.palette.info.main,
                    }}
                  >
                    {row["title" as keyof RowData<T>]}
                  </Typography>
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
                  ) : (
                    <>
                      {formatNumber(
                        parseFloat(row["value" as keyof RowData<T>])
                      )}{" "}
                      {row["unit" as keyof RowData<T>]}
                    </>
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
