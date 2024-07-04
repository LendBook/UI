import { Box, Card, Paper, Typography } from "@mui/material";
import { useState } from "react";
import TabsCustom from "../../components/TabsCustom";
import theme from "../../theme";
import MetricCustom from "../../components/MetricCustom";
import { useDataContext } from "../../context/DataContext";
import TabsCustomV2 from "../../components/TabsCustomV2";
import Supply from "./Supply";
import Withdraw from "./Withdraw";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("");

  const handleToggleClick = (label: string) => {
    setSelectedTab(label);
  };

  const { userInfo, loadingUser } = useDataContext();

  const metricsData = [
    {
      title: "My total supply",
      value: userInfo.totalDepositsQuote,
      unit: "USDC",
    },
    {
      title: "My sell orders which can be withdraw",
      value: 0,
      unit: "WETH",
    },
  ];

  return (
    <div className="mt-20 ml-72 mr-4 mb-20">
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
            <Typography variant="h4" color="black">
              Lend to earn
            </Typography>
            <div className="flex mt-5"></div>

            <div className="flex">
              <MetricCustom data={metricsData} isLoading={loadingUser} />
            </div>

            <div className="flex mt-10"></div>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 1,
                padding: 1,
                display: "inline-block",
                width: "100%",
                //backgroundColor: theme.palette.background.default,
              }}
              className="flex flex-col"
            >
              <TabsCustomV2
                labels={["Supply", "Withdraw"]}
                onClick={handleToggleClick}
              />
              <div className="flex mt-5"></div>
              {selectedTab === "Supply" && <Supply />}
              {selectedTab === "Withdraw" && <Withdraw />}
              <div className="flex mt-2"></div>
            </Paper>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
