import { Button } from "@mui/material";
import React, { useState } from "react";
import theme from "../theme";

type CustomButtonProps = {
  clickable: boolean;
  textClickable: string;
  textNotClickable: string;
  handleClick?: () => void;
  buttonWidth?: number;
  borderRadius?: number;
};

export default function CustomButton({
  clickable,
  handleClick,
  textClickable,
  textNotClickable,
  buttonWidth,
  borderRadius,
}: CustomButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-shrink-0 mr-4">
      <Button
        style={{
          //textTransform: "none",
          width: typeof buttonWidth === "number" ? `${buttonWidth}px` : "auto",
          padding: "5px 10px",
          border: "none",
          alignItems: "center",
          borderRadius:
            typeof borderRadius === "number" ? `${borderRadius}px` : "5px",
          outline: "none",
          backgroundColor: isHovered
            ? clickable
              ? theme.palette.primary.dark
              : theme.palette.error.dark
            : clickable
            ? theme.palette.primary.main
            : theme.palette.error.main,
          color: clickable
            ? theme.palette.common.white
            : theme.palette.common.white,
        }}
        onClick={handleClick}
        disabled={!clickable}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {clickable ? textClickable : textNotClickable}
      </Button>
    </div>
  );
}
