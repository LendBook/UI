import BorrowModule from "./BorrowModule";
import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider} from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const Index = () => {
    return (
        <OrderProvider>
            <Card sx={{ maxWidth: '1300px', margin: 'auto', background: 'transparent', boxShadow: 'none',
                border: 'none' }}>
                    <Box>
                        {/*<Typography variant="h4" style={{ color: 'white' }}>Borrow</Typography>*/}
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
                                    <Orderbook isDeposit={false}/>
                                </div>
                                <div style={{minWidth: '40%'}}>
                                    <BorrowModule />
                                </div>
                            </div>
                        </Grid>
                    </Box>
            </Card>
        </OrderProvider>
    );
};

export default Index;
