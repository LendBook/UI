import { Box, Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import theme from "../theme";

type AnalyticButtonProps = {
  clickable: boolean;
  handleClick?: () => void;
  buttonHeight?: number;
  buttonWidth?: number;
  borderRadius?: number;
};

export default function AnalyticButton({
  clickable,
  handleClick,
  buttonHeight,
  buttonWidth,
  borderRadius,
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
                typeof buttonHeight === "number" ? `${buttonHeight}px` : "auto",
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
            }}
            onClick={handleClick}
            disabled={!clickable}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box
              sx={{
                width: "55%",
                height: "60%",
                borderRadius: 0.6,
                marginRight: 0.8,
                bgcolor: theme.palette.primary.main,
              }}
            />
            <Box
              sx={{
                width: "55%",
                height: "40%",
                borderRadius: 0.5,
                bgcolor: theme.palette.success.main,
              }}
            />
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}
