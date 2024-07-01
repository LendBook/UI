import { Button } from "@mui/material";
import React, { useState } from "react";
import theme from "../theme";

type CustomButtonProps = {
  clickable: boolean;
  textClickable: string;
  textNotClickable: string;
  textAfterClick?: string;
  handleClick?: () => void;
  buttonWidth?: number;
  borderRadius?: number;
};

export default function CustomButton({
  clickable,
  handleClick,
  textClickable,
  textNotClickable,
  textAfterClick,
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
          padding: "6px 10px",
          border: "none",
          alignItems: "center",
          textTransform: "none",
          borderRadius:
            typeof borderRadius === "number" ? `${borderRadius}px` : "5px",
          outline: "none",
          backgroundColor: isHovered
            ? clickable
              ? theme.palette.primary.dark
              : theme.palette.error.main
            : clickable
            ? theme.palette.primary.main
            : theme.palette.error.main,

          color: clickable
            ? theme.palette.common.white
            : theme.palette.info.main,
        }}
        onClick={handleClick}
        //disabled={!clickable}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {clickable
          ? textClickable
          : isHovered
          ? textNotClickable
          : textClickable}
      </Button>
      <div className="flex justify-between items-center max-w-full overflow-hidden">
        <span className="text-[red] text-[12px]">{textAfterClick}</span>
      </div>
    </div>
  );
}
