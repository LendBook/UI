import { Box, Card, Paper, Typography, Tabs, Tab, styled } from "@mui/material";
import { useState } from "react";
import TabsCustom from "../../components/TabsCustom";
import { TabPanel } from "@material-tailwind/react";
import theme from "../../theme";
import TabsCustomV2 from "../../components/TabsCustomV2";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Index = () => {
  const [value, setValue] = useState(0);

  const handleClick = (label: string) => {
    //setSelectedBorrowTab(label);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
        {/* <Box>
          <div>
            <Typography variant="h4" color="black" fontWeight="bold">
              Inaki Test
            </Typography>
            <div className="flex mt-10"></div>
            <Paper
              elevation={4}
              sx={{ borderRadius: 1, padding: 1, display: "inline-block" }}
              className="flex flex-col"
            >
              <TabsCustom
                labels={["As Lender", "As Borrower"]}
                onClick={handleToggleCollateralClick}
              />
            </Paper>
          </div>
        </Box> */}
      </Card>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="basic tabs example"
          >
            <Tab
              label="Deposit collateral"
              {...a11yProps(0)}
              sx={{
                fontWeight: value === 0 ? "bold" : "normal",
                textTransform: "none",
              }}
            />
            <Tab
              label="Withdraw collateral"
              {...a11yProps(1)}
              sx={{
                fontWeight: value === 1 ? "bold" : "normal",
                textTransform: "none",
              }}
            />
            <Tab
              label="Item Three"
              {...a11yProps(2)}
              sx={{
                fontWeight: value === 2 ? "bold" : "normal",
                textTransform: "none",
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          Item One
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
      <Box>
        <TabsCustomV2
          labels={["As Lender", "As Borrower"]}
          //onClick={handleClick}
        />
      </Box>
    </div>
  );
};

export default Index;
