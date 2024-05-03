import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import theme from "../theme";

//valeur à recuperer
//price feed indiquatif in USD

// Définition des types pour les props de AmountCustom
type AmountCustomProps = {
  title?: string;
  tokenWalletBalance: string;
  selectedToken?: string;
  ratioToUSD?: number;
  onQuantityChange?: (quantity: string) => void;
};

// Composant TableCustom
export default function AmountCustom({
  title = "Collateral Amount",
  tokenWalletBalance = "0",
  selectedToken = "USDC",
  ratioToUSD = 1.01,
  onQuantityChange, // Fonction de gestion du changement de quantité passée en prop
}: AmountCustomProps) {
  // const [tokenWalletBalance, settokenWalletBalance] = useState("15232");
  // const [selectedToken, setSelectedToken] = useState("USDC");
  // const ratioToUSD = 1.01;

  const [label, setLabel] = useState("Enter Amount");

  // ORDER VARIABLE
  const [quantity, setQuantity] = useState("");

  // Effet pour suivre les changements de quantity et appeler la fonction onQuantityChange
  useEffect(() => {
    if (onQuantityChange) {
      onQuantityChange(quantity);
    }
  }, [quantity, onQuantityChange]);

  function formatNumber(num: any) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Ajoute une virgule après les trois premiers chiffres
    } else {
      return num.toFixed(2);
    }
  }

  const handleClick = () => {
    setLabel("");
  };
  const handleBlur = () => {
    if (quantity == "") {
      setLabel("Enter Amount");
    }
  };

  const [message, setMessage] = useState("");
  // INPUT
  const onBuyBudgetChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setQuantity("");
        setMessage("");
      } else {
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/,/g, ".");
        let amount = inputValue.replace(/[^0-9.]/g, "");

        // Si plus d'un point décimal est présent, retirer tous les points sauf le premier
        const decimalCount = amount.split(".").length - 1;
        if (decimalCount > 1) {
          amount = amount.replace(/(\.[^.]*)\./g, "$1");
        }

        //let amount = e.target.value;
        //amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "";
        if (amount[0] === ".") amount = "0" + amount;
        setQuantity(amount);
        setMessage("$" + formatNumber(parseFloat(amount) * ratioToUSD));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = tokenWalletBalance;
    setQuantity(maxAmount);
    setMessage("$" + formatNumber(parseFloat(maxAmount) * ratioToUSD));
    setLabel("");
  };

  return (
    <Box className="max-w-[300px]">
      <span className="text-primary text-[24px] font-bold">{title}</span>
      <Paper
        elevation={4}
        style={{ padding: "0px", width: "100%" }}
        className="flex flex-col"
      >
        <TextField
          label={label}
          margin="none"
          value={quantity}
          onChange={onBuyBudgetChange}
          onClick={handleClick}
          onBlur={handleBlur}
          InputLabelProps={{
            style: { color: theme.palette.text.primary },
          }}
          InputProps={{
            style: {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.common.white,
            },
            endAdornment: (
              <InputAdornment position="end">
                <span className="text-dark">{selectedToken}</span>
              </InputAdornment>
            ),
          }}
          sx={{
            fieldset: { borderColor: "transparent" },
          }}
          variant="outlined"
        />
      </Paper>
      <div className="flex justify-between items-center">
        <span className="text-dark text-[12px]">{message}</span>
        <div className="flex items-center">
          <span className="text-dark text-[12px]">
            Balance: {formatNumber(parseFloat(tokenWalletBalance))}
          </span>
          <div style={{ width: "10px" }} /> {/* Espace */}
          <button
            className="text-dark text-[12px] underline font-bold"
            onClick={handleMaxClick}
          >
            Max
          </button>
        </div>
      </div>
    </Box>
  );
}
