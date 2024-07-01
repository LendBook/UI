import { Box, Card, Paper, Typography } from "@mui/material";
import { useState } from "react";
import TabsCustom from "../../components/TabsCustom";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("");

  const handleToggleCollateralClick = (label: string) => {
    setSelectedTab(label);
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
        <Box>
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
        </Box>
      </Card>
    </div>
  );
};

export default Index;
