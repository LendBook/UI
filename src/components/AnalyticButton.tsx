import { Box, Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import theme from "../theme";
import { formatNumber } from "./GlobalFunctions";

type AnalyticButtonProps = {
  clickable: boolean;
  handleClick?: () => void;
  borderRadius?: number;
  buttonHeight?: number;
  buttonWidth?: number;
  boxLendHeightRatio?: number;
  boxBorrowHeightRatio?: number;
  userBoxHeight?: number;
  price: number;
  lendAPY: number;
  borrowAPY: number;
};

export default function AnalyticButton({
  clickable,
  handleClick,
  borderRadius,
  buttonHeight,
  buttonWidth,
  boxLendHeightRatio,
  boxBorrowHeightRatio,
  userBoxHeight,
  price,
  lendAPY,
  borrowAPY,
}: AnalyticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-shrink-0 ">
      <Tooltip
        open={!clickable && isHovered}
        disableHoverListener={clickable}
        title=""
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          <Button
            style={{
              //textTransform: "none",
              height:
                typeof buttonHeight === "number" ? `${buttonHeight}px` : "20px",
              width:
                typeof buttonWidth === "number" ? `${buttonWidth}px` : "auto",
              borderRadius:
                typeof borderRadius === "number" ? `${borderRadius}px` : "5px",
              backgroundColor: isHovered
                ? theme.palette.secondary.main
                : theme.palette.error.main,
              display: "flex", // Aligner les Box en ligne
              justifyContent: "center", // Centrer horizontalement
              alignItems: "flex-end", // center
              position: "relative",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onClick={handleClick}
            disabled={!clickable}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box
              sx={{
                width: "55%",
                height:
                  typeof boxLendHeightRatio === "number"
                    ? `${boxLendHeightRatio}`
                    : "0px",
                borderRadius: 0.6,
                marginRight: 0.8,
                bgcolor: isHovered
                  ? theme.palette.primary.main
                  : theme.palette.primary.main,
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
            />
            <Box
              sx={{
                width: "55%",
                height:
                  typeof boxBorrowHeightRatio === "number"
                    ? `${boxBorrowHeightRatio}`
                    : "0px",
                borderRadius: 0.5,
                bgcolor: isHovered
                  ? theme.palette.success.main
                  : theme.palette.success.main,
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 4px)", // Ajoute une marge de 4px en dessous de l'élément principal
                width: "100%",
                height:
                  typeof userBoxHeight === "number"
                    ? `${userBoxHeight}px`
                    : "0px",
                borderRadius: 0.5,
                bgcolor: isHovered
                  ? theme.palette.primary.main
                  : theme.palette.primary.main,
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "100%", // Positionne le texte en dessous de l'élément principal
                  left: "50%", // Positionne le début du texte au milieu horizontalement
                  transform: "rotate(45deg) ", // Incline le texte et ajuste la position de son point de départ
                  transformOrigin: "0 0", // Point d'origine de la rotation
                  whiteSpace: "nowrap", // Empêche le texte de se briser sur plusieurs lignes
                  color: theme.palette.secondary.main,
                  fontWeight: isHovered ? "bold" : "inherite",
                  fontSize: isHovered ? "110%" : "inherite",
                  transition: "font-weight 0.3s ease, transform 0.3s ease",
                }}
              >
                {formatNumber(price)}
              </Box>
            </Box>
            {lendAPY != 0 ? (
              <Box
                sx={{
                  position: "absolute",
                  top: "0px", // Positionne le texte en dessous de l'élément principal
                  //left: "50%", // Positionne le début du texte au milieu horizontalement
                  color: isHovered
                    ? theme.palette.error.main
                    : theme.palette.secondary.main,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
              >
                {formatNumber(lendAPY)}%
              </Box>
            ) : (
              ""
            )}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}
