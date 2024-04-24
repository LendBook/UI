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

// Type générique pour une ligne de données
type RowData<T extends string | number> = Record<T, string | number>;

// Définition des types pour les props de TableCustom
type TableProps<T extends string | number> = {
  data: RowData<T>[];
  clickableRows?: boolean; // Marquer clickableRows comme optionnelle avec une valeur par défaut
  onRowClick?: (row: RowData<T>) => void;
};

// Style des cellules
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#e9f4ff",
    color: "#7d96af",
    fontWeight: "bold",
    borderBottom: "0px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#333333", // Couleur de texte personnalisée pour les cellules du corps
    borderBottom: "1px solid #e9f4ff",
  },
}));

// Style pour la ligne au survol
const HoverTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#a7c1dc",
  },
}));

// Composant TableCustom
export default function TableCustom<T extends string | number>({
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
    <div className="container relative z-2 mt-10">
      <div className="text-primary">Hello</div>
      <Box
        component={Paper}
        elevation={1} // Ombre du cadre
        sx={{ borderRadius: 1, padding: 2 }} // Styles du cadre
      >
        <TableContainer component={Paper} elevation={0}>
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
                const isRowClickable = clickableRows && activeRow !== rowIndex;
                const rowStyles = {
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                  cursor: isRowClickable ? "pointer" : "default",
                  backgroundColor:
                    rowIndex === activeRow ? "#a7c1dc" : "inherit",
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
  );
}
