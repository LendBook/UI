import { Box, Card } from "@mui/material";
import TableCustom from "../TableCustom";
import AmountCustom from "../AmountCustom";
import { useState } from "react";
import MetricCustom from "../MetricCustom";

const dataTable = [
  {
    "Data A": "1000 USDC",
    "Data B": "1000 USDC",
  },
  {
    "Data A": "1000 USDC",
    "Data B": "1000 USDC",
  },
  {
    "Data A": "1000 USDC",
    "Data B": "1000 USDC",
  },
];

const Index = () => {
  const [supplyAmountQuantity, setSupplyAmountQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState("");
  const [buttonClickable, setButtonClickable] = useState(false);
  const [message, setMessage] = useState("");

  const updateButtonClickable = (supplyAmountQuantity: any, buyPrice: any) => {
    if (supplyAmountQuantity > 0 && buyPrice !== "") {
      setButtonClickable(true);
    } else {
      setButtonClickable(false);
    }
    setMessage(
      "Transaction parameters : supply=" +
        supplyAmountQuantity +
        " AND buy price =" +
        buyPrice
    );
  };

  // Fonction pour gérer les changements de valeur de quantity
  const handleQuantityChange = (newQuantity: any) => {
    setSupplyAmountQuantity(newQuantity);
    updateButtonClickable(newQuantity, buyPrice);
  };

  const handleRowClick = (rowData: any) => {
    setBuyPrice(rowData["Buy Price"]);
    updateButtonClickable(supplyAmountQuantity, rowData["Buy Price"]);
  };
  

  return (
    <div className="mt-20 ml-72 mr-4">
      <Card
        sx={{
          maxWidth: "1100px",
          margin: "auto",
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Box>
          <div>
            <div className=" text-primary text-[48px] font-bold">
              TEMPLATE
            </div>
            <div className="flex flex-col md-plus:flex-row space-between items-baseline">
              <div className="container" style={{ marginBottom: "10px" }}>
                Template
              </div>
              
            </div>

            <div className="flex mt-10">
              <div className="container">
                <TableCustom
                  title="Template"
                  data={dataTable}
                  clickableRows={true}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
            
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
