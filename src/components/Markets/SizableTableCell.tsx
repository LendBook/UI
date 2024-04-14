import { TableCell, TableCellProps } from "@mui/material";

type SizableTableCellProps = TableCellProps & {
  width?: string;
};
function SizableTableCell(props: SizableTableCellProps) {
  const { width, children } = props;

  return (
    <TableCell
      {...props}
      sx={{
        ...props.sx,
        minWidth: `${width} !important`,
        maxWidth: `${width} !important`,
      }}
    >
      {children}
    </TableCell>
  );
}

export default SizableTableCell;
