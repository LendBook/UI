import {
  Box,
  Card,
  Paper,
  Typography,
  Tabs,
  Tab,
  styled,
  ToggleButton,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import theme from "../theme";

type TabProps = {
  labels: string[];
  onClick?: (label: string) => void;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabsCustom({ labels, onClick }: TabProps) {
  //const [alignment, setAlignment] = React.useState(labels[0]);

  const [value, setValue] = useState(0);
  if (onClick) {
    onClick(labels[value]);
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onClick) {
      onClick(labels[newValue]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="basic tabs example"
          TabIndicatorProps={{
            style: {
              height: "3px",
            },
          }}
          //variant="fullWidth"
        >
          {labels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              {...a11yProps(index)}
              sx={{
                fontWeight: value === index ? "bold" : "normal",
                textTransform: "none",
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
