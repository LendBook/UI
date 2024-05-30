import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import TabsCustom from "../TabsCustom";
import AsLender from "./AsLender";
import AsBorrower from "./AsBorrower";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("");

  const handleToggleClick = (label: string) => {
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
          <Typography variant="h3" color="black" fontWeight="bold">
            My Dashboard
          </Typography>
        </Box>

        <div className="flex mt-10">
          <div className="container">
            <TabsCustom
              labels={["As Lender", "As Borrower"]}
              onClick={handleToggleClick}
            />
          </div>
        </div>
        {selectedTab === "As Lender" && <AsLender />}
        {selectedTab === "As Borrower" && <AsBorrower />}
      </Card>
    </div>
  );
};

export default Index;
