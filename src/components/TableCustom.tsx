import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"; // Import de Box pour créer le cadre
import { styled } from "@mui/material/styles";
import theme from "../theme";
import { title } from "process";

// Type générique pour une ligne de données
type RowData<T extends string | number> = Record<T, string | number>;

// Définition des types pour les props de TableCustom
type TableProps<T extends string | number> = {
  title?: string;
  data: RowData<T>[];
  clickableRows?: boolean; // Marquer clickableRows comme optionnelle avec une valeur par défaut
  onRowClick?: (row: RowData<T>) => void;
};

// Style des cellules
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.info.main,
    fontWeight: "bold",
    borderBottom: "0px",
    paddingTop: "5px", // Adjust the top padding as per your requirement
    paddingBottom: "5px", // Adjust the bottom padding as per your requirement
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black, // Couleur de texte personnalisée pour les cellules du corps
    borderBottom: "1px solid",
    paddingTop: "8px", // Adjust the top padding as per your requirement
    paddingBottom: "8px", // Adjust the bottom padding as per your requirement
    borderColor: theme.palette.background.default,
  },
}));

// Style pour la ligne au survol
const HoverTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.background.default, //theme.palette.action.hover,
    "& .MuiTableCell-root": {
      //color: theme.palette.common.white, // Changement de couleur du texte en blanc
    },
  },
}));

// Composant TableCustom
export default function TableCustom<T extends string | number>({
  title = "Select",
  data,
  clickableRows = false, // Définir clickableRows à false par défaut
  onRowClick,
}: TableProps<T>) {
  const columns = data.length > 0 ? (Object.keys(data[0]) as T[]) : [];
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const handleClick = (rowIndex: number, row: RowData<T>) => {
    if (!clickableRows || activeRow === rowIndex) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
    }

    setActiveRow(rowIndex);
  };

  return (
    <Box>
      <span className="text-primary text-[24px] font-bold">{title}</span>
      <div className="container relative z-2 mt-10">
        <Box
          component={Paper}
          elevation={4} // Ombre du cadre
          sx={{
            borderRadius: 1,
            padding: 1,
          }} // Styles du cadre
        >
          <TableContainer
            component={Paper}
            elevation={0}
            // sx={{
            //   maxWidth: "100%",
            //   overflowX: "auto",
            //   "@media (max-width: 1000px)": {
            //     maxWidth: "1000px", // Définir une largeur maximale pour le TableContainer
            //   },
            // }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <StyledTableCell key={index}>{column}</StyledTableCell>
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
                    backgroundColor:
                      rowIndex === activeRow
                        ? theme.palette.primary.main
                        : "inherit",
                    "& .MuiTableCell-root":
                      rowIndex === activeRow
                        ? {
                            color: theme.palette.common.white, // Changement de couleur du texte en blanc
                          }
                        : "inherit",
                  };

                  if (isRowClickable) {
                    return (
                      <HoverTableRow
                        key={rowIndex}
                        onClick={() => handleClick(rowIndex, row)}
                        sx={rowStyles}
                      >
                        {columns.map((column, colIndex) => (
                          <StyledTableCell key={colIndex} align="left">
                            {row[column as keyof RowData<T>]}
                          </StyledTableCell>
                        ))}
                      </HoverTableRow>
                    );
                  } else {
                    // If not clickable, render a regular TableRow
                    return (
                      <TableRow key={rowIndex} sx={rowStyles}>
                        {columns.map((column, colIndex) => (
                          <StyledTableCell key={colIndex} align="left">
                            {row[column as keyof RowData<T>]}
                          </StyledTableCell>
                        ))}
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
