import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
    backgroundColor: "#e9f4ffff",
    color: "#7d96af",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#333", // Couleur de texte personnalisée pour les cellules du corps
  },
}));

// Style pour la ligne au survol
const HoverTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#88a7c6",
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
      <TableContainer component={Paper}>
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
                backgroundColor: rowIndex === activeRow ? "#88a7c6" : "inherit",
              };

              if (isRowClickable) {
                return (
                  <HoverTableRow
                    key={rowIndex}
                    onClick={() => handleClick(rowIndex, row)}
                    sx={rowStyles}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} align="left">
                        {row[column as keyof RowData<T>]}
                      </TableCell>
                    ))}
                  </HoverTableRow>
                );
              } else {
                // If not clickable, render a regular TableRow
                return (
                  <TableRow key={rowIndex} sx={rowStyles}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} align="left">
                        {row[column as keyof RowData<T>]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
