import BorrowModule from "./BorrowModule";
import Orderbook from "../Orderbook/Orderbook";
import { OrderProvider} from "../Orderbook/OrderContext";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

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
                        <Typography variant="h4" style={{ color: 'white' }}>Borrow</Typography>
                        <Grid
                            container
                            mt="2.5rem"
                            mb="1rem"
                            justifyContent="space-between"
                            alignItems="stretch" // Stretching the items to match height
                            wrap="wrap"
                        >
                            <div style={{ display: 'flex', height: '100%' }}>
                                <div style={{ flex: '2', minWidth: '60%'}}>
                                    <Orderbook isTrade={false}/> {/* Setting height to 100% */}
                                </div>
                                <div style={{ flex: '1', minWidth: '40%'}}>
                                    <BorrowModule /> {/* Setting height to 100% */}
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
