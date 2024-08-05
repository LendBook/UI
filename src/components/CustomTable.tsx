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

// Type générique pour une ligne de données
type RowData<T extends string | number> = Record<T, string | number> & {
  id: number;
};

// Définition des types pour les props de CustomTable
type TableProps<T extends string | number> = {
  title?: string;
  columnsConfig: {
    key: T;
    title: string;
    metric?: string;
    isButton?: boolean;
    onButtonClick?: (id: number) => void;
  }[];
  data: RowData<T>[]; //data object needs to have at least "id" as one of his key
  clickableRows?: boolean;
  onRowClick?: (row: RowData<T>) => void;
  isLoading?: boolean;
};

// Style des cellules
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    fontWeight: "bold",
    //backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.main,
    //fontWeight: "bold",
    borderBottom: "1px solid", //"0px",
    borderColor: theme.palette.error.main, //theme.palette.primary.main, //"white", //theme.palette.background.default, //theme.palette.background.default,
    paddingTop: "10px",
    paddingBottom: "3px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.palette.text.primary, //theme.palette.secondary.main, //theme.palette.common.black, // theme.palette.info.main,
    borderBottom: "1px solid",
    paddingTop: "15px",
    paddingBottom: "15px",
    borderColor: theme.palette.error.main, //theme.palette.primary.main, //"white", //theme.palette.background.default, //theme.palette.background.default,
  },
}));

// Style pour la ligne au survol
const HoverTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main, //"white", //theme.palette.background.default, //theme.palette.warning.main, //"white", //theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.error.main, //theme.palette.error.main,
  },
}));

// Composant CustomTable
export default function CustomTable<T extends string | number>({
  title = "Select",
  columnsConfig,
  data,
  clickableRows = false,
  onRowClick,
  isLoading = false,
}: TableProps<T>) {
  const columns = columnsConfig.map((config) => config.key);

  const [activeRow, setActiveRow] = useState<number | null>(null);

  const handleClick = (rowIndex: number, row: RowData<T>) => {
    if (!clickableRows || activeRow === rowIndex) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
    }

    setActiveRow(rowIndex);
    console.log(data);
  };

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
            backgroundColor: theme.palette.warning.main,
          }}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table
              sx={{
                minWidth: 650,
                // border: "1px solid",
                // borderCollapse: "collapse",
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {columnsConfig.map((column, index) => (
                    <StyledTableCell key={column.key}>
                      {column.title}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => {
                  const isRowClickable =
                    clickableRows && activeRow !== rowIndex;
                  const rowStyles = {
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                    cursor: isRowClickable ? "pointer" : "default",
                    // backgroundColor:
                    //   rowIndex === activeRow
                    //     ? theme.palette.primary.main
                    //     : "inherit",
                    "& .MuiTableCell-root":
                      rowIndex === activeRow
                        ? {
                            color: theme.palette.common.black,
                            backgroundColor: theme.palette.primary.main,
                          }
                        : "inherit",
                  };

                  if (isRowClickable) {
                    return (
                      <HoverTableRow
                        key={row.id}
                        onClick={() => handleClick(rowIndex, row)}
                        sx={rowStyles}
                      >
                        {columns.map((column, colIndex) => {
                          const columnConfig = columnsConfig.find(
                            (config) => config.key === column
                          );
                          if (columnConfig && columnConfig.isButton) {
                            // Si la colonne est configurée comme étant un bouton
                            return (
                              <StyledTableCell key={colIndex} align="left">
                                {/* <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    columnConfig.onButtonClick &&
                                    columnConfig.onButtonClick(row.id as number)
                                  }
                                > 
                                  {row[column as keyof RowData<T>]}
                                </Button>*/}
                                <CustomButton
                                  clickable={true}
                                  handleClick={() =>
                                    columnConfig.onButtonClick &&
                                    columnConfig.onButtonClick(row.id as number)
                                  }
                                  textClickable={
                                    row[column as keyof RowData<T>] as string
                                  }
                                  textNotClickable={
                                    row[column as keyof RowData<T>] as string
                                  }
                                  textAfterClick=""
                                  buttonWidth={120}
                                  borderRadius={50}
                                />
                              </StyledTableCell>
                            );
                          } else {
                            return (
                              <StyledTableCell key={colIndex} align="left">
                                {isLoading ? (
                                  <Skeleton variant="text" />
                                ) : (
                                  <>
                                    {columnsConfig[colIndex].metric !==
                                    undefined
                                      ? `${formatNumber(
                                          row[column as keyof RowData<T>]
                                        )} ${columnsConfig[colIndex].metric}`
                                      : `${row[column as keyof RowData<T>]}`}
                                  </>
                                )}
                              </StyledTableCell>
                            );
                          }
                        })}
                        {/* {columns.map((column, colIndex) => (
                          <StyledTableCell key={colIndex} align="left">
                            {isLoading ? (
                              <Skeleton variant="text" />
                            ) : (
                              <>
                                {columnsConfig[colIndex].metric !== undefined
                                  ? `${formatNumber(
                                      row[column as keyof RowData<T>]
                                    )} ${columnsConfig[colIndex].metric}`
                                  : `${row[column as keyof RowData<T>]}`}
                              </>
                            )}
                          </StyledTableCell>
                        ))} */}
                      </HoverTableRow>
                    );
                  } else {
                    return (
                      <TableRow key={row.id} sx={rowStyles}>
                        {columns.map((column, colIndex) => {
                          const columnConfig = columnsConfig.find(
                            (config) => config.key === column
                          );
                          if (columnConfig && columnConfig.isButton) {
                            // Si la colonne est configurée comme étant un bouton
                            return (
                              <StyledTableCell key={colIndex} align="left">
                                <CustomButton
                                  clickable={true}
                                  handleClick={() =>
                                    columnConfig.onButtonClick &&
                                    columnConfig.onButtonClick(row.id as number)
                                  }
                                  textClickable={
                                    row[column as keyof RowData<T>] as string
                                  }
                                  textNotClickable={
                                    row[column as keyof RowData<T>] as string
                                  }
                                  textAfterClick=""
                                  buttonWidth={150}
                                  borderRadius={50}
                                />
                                {/* <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    columnConfig.onButtonClick &&
                                    columnConfig.onButtonClick(row.id as number)
                                  }
                                >
                                  {row[column as keyof RowData<T>]}
                                </Button> */}
                              </StyledTableCell>
                            );
                          } else {
                            return (
                              <StyledTableCell key={colIndex} align="left">
                                {columnsConfig[colIndex].metric !== undefined
                                  ? `${formatNumber(
                                      row[column as keyof RowData<T>]
                                    )} ${columnsConfig[colIndex].metric}`
                                  : `${row[column as keyof RowData<T>]}`}
                              </StyledTableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </Box>
  );
}
