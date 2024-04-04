import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider } from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TradeModule from "./TradeModule";

const Index = () => {
  return (
    <OrderProvider>
      <Card
        sx={{
          maxWidth: "1300px",
          margin: "auto",
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Box>
          <Grid
            container
            mt="2.5rem"
            mb="1rem"
            justifyContent="space-between"
            alignItems="stretch"
            wrap="wrap"
          >
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "60%" }}>
                <Orderbook isDeposit={true} />
              </div>
              <div style={{ minWidth: "40%" }}>
                <TradeModule />
              </div>
            </div>
          </Grid>
        </Box>
      </Card>
    </OrderProvider>
  );
};

export default Index;
