import {
    Box,
    Card,
    CardContent,
    Grid,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Table,
    useTheme
} from "@mui/material";
import Typography from "@mui/material/Typography";
import SizableTableCell from './SizableTableCell';
import ethIcon from "../../asserts/images/coins/eth.svg";
import usdcIcon from "../../asserts/images/coins/usdc.svg";
import usdtIcon from "../../asserts/images/coins/usdt.svg";
import wbtcIcon from "../../asserts/images/coins/wbtc.svg";
import daiIcon from "../../asserts/images/coins/dai.svg";
import stethIcon from "../../asserts/images/coins/steth.svg";
import BlastIcon from "../../asserts/images/networks/Blast.svg";
import {useNavigate} from "react-router-dom";

export default function Markets() {

    const { palette } = useTheme();
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate('/deposit');
    };

    return (
        <Card sx={{ maxWidth: '1300px', margin: 'auto', background: 'transparent', boxShadow: 'none',
            border: 'none' }}>

                <Box>
                    {/*<Typography variant="h4" style={{ color: 'white' }}>Markets</Typography>*/}
                    <Grid
                        container
                        mt="2.5rem"
                        mb="1rem"
                        justifyContent="space-between"
                        alignItems="center"
                        wrap="wrap"
                    >
                        <TableContainer sx={{ mt: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '3px solid #34363e' }}>
                            <Table
                                aria-label="Markets table"
                                sx={{ borderCollapse: 'initial', backgroundColor: '#131518'}}
                            >
                                <TableHead sx={{
                                    '& > td': {
                                        borderBottom: 'none',
                                    },
                                }} >
                                    <TableRow sx={{ height: '2.625rem'}}>
                                        <SizableTableCell align="left" width="160px" style={{ color: 'white'}}>
                                            Assets
                                        </SizableTableCell>
                                        <SizableTableCell align="left" width="160px" style={{ color: 'white'}}>
                                            Collateral
                                        </SizableTableCell>
                                        <SizableTableCell width="100px" align="left"  style={{ color: 'white'}}>
                                            Network
                                        </SizableTableCell>
                                      {/*  <SizableTableCell width="100px" align="right" style={{ color: 'white'}}>
                                            <Stack
                                                direction="row"
                                                spacing="0.25rem"
                                                alignItems="center"
                                                justifyContent="right"
                                            >
                                             Supply APY
                                            </Stack>
                                        </SizableTableCell> */}
                                        <SizableTableCell width="120px" align="right" style={{ color: 'white'}}>
                                            APY
                                        </SizableTableCell>
                                        <SizableTableCell width="120px" align="right" style={{ color: 'white'}}>
                                            Liquidity
                                        </SizableTableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{border: '3px solid #34363e' }} >
                                    <TableRow
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            },
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            /* '&:hover': {
                                                 backgroundColor: '#34363e',
                                                 cursor: 'pointer',
                                             },*/
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        //  onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={wbtcIcon} alt="WBTC" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>WBTC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                           /* '&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={stethIcon} alt="stETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>stETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                           /* '&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                       // onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={usdtIcon} alt="USDT" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDT</Typography>

                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            /*'&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                     //   onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={usdtIcon} alt="USDT" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDT</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={wbtcIcon} alt="WBTC" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>WBTC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            /*'&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        //   onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={usdtIcon} alt="USDT" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDT</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={stethIcon} alt="stETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>stETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            /* '&:hover': {
                                                 backgroundColor: '#34363e',
                                                 cursor: 'pointer',
                                             }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        //   onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={daiIcon} alt="DAI" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>DAI</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                           /* '&:hover': {
                                                backgroundColor: '#34363e',
                                                cursor: 'pointer',
                                            }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                     //   onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={daiIcon} alt="DAI" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>DAI</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={wbtcIcon} alt="WBTC" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>WBTC</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>

                                    <TableRow
                                        sx={{
                                            /* '&:hover': {
                                                 backgroundColor: '#34363e',
                                                 cursor: 'pointer',
                                             }, */
                                            '& > td': {
                                                borderBottom: 'none',
                                            },
                                        }}
                                        //   onClick={handleRowClick}
                                    >
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={daiIcon} alt="DAI" style={{ width: '24px', height: '24px' , marginRight: '8px'   }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>DAI</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <img src={stethIcon} alt="stETH" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>stETH</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={BlastIcon} alt="BLAST" style={{ width: '24px', height: '24px' , marginRight: '8px'  }} />
                                                <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>BLAST</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" style={{ color: 'white'}}>3%</TableCell>
                                        
                                        <TableCell align="right" style={{ color: 'white'}}>$10,000</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Box>
        </Card>
    );
}
