import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider} from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import DepositModule from "./DepositModule";

const Index = () => {
    return (
        <OrderProvider>
            <Card sx={{ maxWidth: '1300px', margin: 'auto', background: 'transparent', boxShadow: 'none',
                border: 'none' }}>
                <CardContent
                    sx={{
                        width: '100%',
                        p: '1.5rem 2rem 1.5rem 2rem',
                        mb: '2rem',
                    }}
                >
                    <Box>
                        <Typography variant="h4" style={{ color: 'white' }}>Deposit</Typography>
                        <Grid
                            container
                            mt="2.5rem"
                            mb="1rem"
                            justifyContent="space-between"
                            alignItems="stretch"
                            wrap="wrap"
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={{minWidth: '60%'}}>
                                    <Orderbook isDeposit={true}/>
                                </div>
                                <div style={{minWidth: '40%'}}>
                                    <DepositModule />
                                </div>
                            </div>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </OrderProvider>
    );
};

export default Index;
