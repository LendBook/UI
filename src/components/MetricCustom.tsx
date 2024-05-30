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
import { title } from "process";
import { formatNumber } from "./GlobalFunctions";

//valeur à recuperer
//price feed indiquatif in USD

// Type générique pour une ligne de données
type RowData<T extends string> = Record<T, string>;

// Définition des types pour les props de TableCustom
type MetricCustomProps<T extends string> = {
  data: RowData<T>[];
};

const Container = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

// Composant TableCustom
export default function MetricCustom<T extends string>({
  data,
}: MetricCustomProps<T>) {
  // const [tokenWalletBalance, settokenWalletBalance] = useState("15232");
  // const [selectedToken, setSelectedToken] = useState("USDC");
  // const ratioToUSD = 1.01;

  return (
    <Paper
      elevation={4}
      sx={{ borderRadius: 1, padding: 1, display: "inline-block" }}
      className="flex flex-col"
    >
      <Container>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex} //className="min-w-[300px]"
          >
            <Paper
              elevation={0}
              style={{
                borderRadius: 1,
                padding: 2,
                backgroundColor: theme.palette.background.default,
                //marginRight: rowIndex !== data.length - 1 ? 10 : 0,
                //marginBottom: rowIndex !== data.length - 1 ? 10 : 0,
                width: "300px",
              }}
              className="flex flex-col"
            >
              <div style={{ marginLeft: 10 }}>
                <Typography
                  variant="body2"
                  style={{
                    fontWeight: "bold",
                    color: theme.palette.info.main,
                  }}
                >
                  {row["title" as keyof RowData<T>]}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ color: "votre_couleur_phrase" }}
                >
                  {formatNumber(parseFloat(row["value" as keyof RowData<T>]))}{" "}
                  {row["unit" as keyof RowData<T>]}
                </Typography>
              </div>
            </Paper>
          </div>
        ))}
      </Container>
    </Paper>
  );
}
