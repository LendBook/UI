import { Box, Card, Paper, Typography } from "@mui/material";
import { useState } from "react";
import TabsCustom from "../../components/TabsCustom";
import CollateralDeposit from "./CollateralDeposit";
import CollateralWithdraw from "./CollateralWithdraw";
import Borrow from "./Borrow";
import Repay from "./Repay";
import theme from "../../theme";
import MetricCustom from "../../components/MetricCustom";
import { useDataContext } from "../../context/DataContext";
import TabsCustomV2 from "../../components/TabsCustomV2";

const Index = () => {
  const [selectedCollateralTab, setSelectedCollateralTab] =
    useState<string>("");
  const [selectedBorrowTab, setSelectedBorrowTab] = useState<string>("");

  const handleToggleCollateralClick = (label: string) => {
    setSelectedCollateralTab(label);
  };
  const handleToggleBorrowClick = (label: string) => {
    setSelectedBorrowTab(label);
  };

  const { userInfo, userDeposits, loadingUser, marketInfo } = useDataContext();

  const metricsData = [
    {
      title: "Total supply",
      value: marketInfo.totalDeposit.toString() as string,
      unit: marketInfo.quoteTokenSymbol,
      tooltipText:
        "Total supply for this isolated market (sum of all the lending supply of the pools)",
    },
    {
      title: "Total borrow",
      value: marketInfo.totalBorrow.toString() as string,
      unit: marketInfo.quoteTokenSymbol,
      tooltipText:
        "Total borrow for this isolated market (sum of all the borrowing positions of the pools)",
    },
  ];

  const userMetricsData = [
    {
      title: "My total collateral",
      value: userInfo.totalDepositsBase,
      unit: marketInfo.baseTokenSymbol,
      tooltipText: "",
    },
    {
      title: "My free collateral",
      value: userInfo.excessCollateral,
      unit: marketInfo.baseTokenSymbol,
      tooltipText: "Your collateral still available",
    },
    {
      title: "My total borrows",
      value: userInfo.totalBorrow,
      unit: marketInfo.quoteTokenSymbol,
      tooltipText: "",
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
            <div className="flex ">
              <Typography variant="h3" color="black">
                Borrow
              </Typography>
              <div className="flex ml-10">
                <MetricCustom
                  data={metricsData}
                  isLoading={false}
                  backgroundColorChosen={theme.palette.warning.main}
                />
              </div>
            </div>
            <div className="flex flex-row items-start  mt-5">
              <Paper
                elevation={0} //4
                sx={{
                  borderRadius: 1,
                  padding: 1,
                  display: "inline-block",
                  border: `0px solid ${theme.palette.error.main}`, //
                  //flexGrow: 1,
                  //backgroundColor: "#f6fbff", //theme.palette.background.default,
                }}
                className="flex"
              >
                <TabsCustomV2
                  labels={["Deposit collateral", "Withdraw collateral"]}
                  onClick={handleToggleCollateralClick}
                />
                <div className="flex mt-5"></div>
                {selectedCollateralTab === "Deposit collateral" && (
                  <CollateralDeposit />
                )}
                {selectedCollateralTab === "Withdraw collateral" && (
                  <CollateralWithdraw />
                )}
                <div className="flex mt-2"></div>
              </Paper>
              <div className="flex" style={{ marginLeft: "30px" }}>
                <MetricCustom
                  data={userMetricsData}
                  isLoading={loadingUser}
                  displayedInColumn={true}
                />
              </div>
            </div>
            {/* <div className="flex" style={{ marginLeft: "10px" }}>
              <MetricCustom data={metricsData} />
            </div> */}

            <div className="flex mt-10"></div>
            <Paper
              elevation={0} //4
              sx={{
                borderRadius: 1,
                padding: 1,
                display: "inline-block",
                width: "100%",
                border: `0px solid ${theme.palette.error.main}`, //
                //backgroundColor: theme.palette.background.default,
              }}
              className="flex flex-col"
            >
              <TabsCustomV2
                labels={["Borrow", "Repay"]}
                onClick={handleToggleBorrowClick}
              />
              <div className="flex mt-5"></div>
              {selectedBorrowTab === "Borrow" && <Borrow />}
              {selectedBorrowTab === "Repay" && <Repay />}
              <div className="flex mt-2"></div>
            </Paper>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default Index;
