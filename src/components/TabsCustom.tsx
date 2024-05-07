import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../theme";

type TabProps = {
  labels: string[];
};

const StyledToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
  backgroundColor: selected ? "black" : "inherit",
}));

export default function TabsCustom({ labels }: TabProps) {
  const [alignment, setAlignment] = React.useState(labels[0]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Paper
      elevation={4}
      sx={{ borderRadius: 1, padding: 1, display: "inline-block" }}
      className="flex flex-col"
    >
      <div>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          {labels.map((label) => (
            <ToggleButton
              key={label}
              value={label}
              style={{
                backgroundColor:
                  alignment === label ? theme.palette.primary.main : "inherit",
                color:
                  alignment === label ? theme.palette.common.white : "inherit",
              }}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </Paper>
  );
}
