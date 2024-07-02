import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../theme";

type TabProps = {
  labels: string[];
  onClick?: (label: string) => void;
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    //margin: theme.spacing(0.5),
    border: `2px solid ${theme.palette.primary.main}`,
    textTransform: "none",
    fontSize: "100%",
    padding: "3px 16px",
  },
}));

export default function TabsCustom({ labels, onClick }: TabProps) {
  const [alignment, setAlignment] = React.useState(labels[0]);
  if (onClick) {
    onClick(alignment);
  }

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      if (onClick) {
        onClick(newAlignment);
      }
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    const hoveredButton = (event.currentTarget as HTMLButtonElement).value;
    if (hoveredButton === alignment) {
      return;
    }
    event.currentTarget.style.backgroundColor =
      theme.palette.background.default; //theme.palette.action.hover;
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    const hoveredButton = (event.currentTarget as HTMLButtonElement).value;
    if (hoveredButton === alignment) {
      return;
    }
    event.currentTarget.style.backgroundColor = "inherit";
  };

  return (
    <Paper
      elevation={0} //4
      sx={{ borderRadius: 1, padding: 0, display: "inline-block" }}
      className="flex flex-col"
    >
      <StyledToggleButtonGroup
        size="small"
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        {labels.map((label) => (
          <ToggleButton
            key={label}
            value={label}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor:
                alignment === label ? theme.palette.primary.main : "inherit",
              color:
                alignment === label
                  ? theme.palette.common.white
                  : theme.palette.primary.main,
              //fontWeight: "bold",
              fontWeight: alignment === label ? "bold" : "inherit",
            }}
          >
            {label}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Paper>
  );
}
