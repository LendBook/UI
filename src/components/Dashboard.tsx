import "../asserts/scss/custom.scss";
import {
  Accordion,
  AccordionSummary,
  Box, Card,
  CardContent,
  Grid, Stack,
  Switch, Tab,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs,
  TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {ethers} from "ethers";
import {useWithdraw} from "../hooks/useWithdraw";
import {useRepay} from "../hooks/useRepay";
import {useChangeBorrowable} from "../hooks/useChangeBorrowable";
import Button from "@mui/material/Button";
import useIncreaseSize from "../hooks/useIncreaseSize";
import useChangeLimitPrice from "../hooks/useChangeLimitPrice";
import useChangePairedPrice from "../hooks/useChangePairedPrice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useIncreaseSizeBorrow from "../hooks/useIncreaseSizeBorrow";
import Typography from "@mui/material/Typography";
import SizableTableCell from "./Markets/SizableTableCell";
import ethIcon from "../asserts/images/coins/eth.svg";
import usdcIcon from "../asserts/images/coins/usdc.svg";
import BlastIcon from "../asserts/images/networks/Blast.svg";
import {useEthersSigner} from "../contracts/index";
import Contrats from "../contracts/contracts/168587773.json";
import {getEthPrice, getUSDCPrice, orderbookContract} from "../contracts/index";


interface Order {
  id: number;
  order: string;
  size: string;
  asset: string;
  nextLimitPrice: string;
  pairedPrice: string;
  isBorrowable: boolean;
  lendRatio: number;
  apy: number;
}

interface Borrow {
  id:number;
  asset: string;
  size: string;
  closingPrice: string;
  apy: number;
}


export default function Dashboard() {

  const signer = useEthersSigner();
  const {address} = useAccount();

  const [countTotalBalance, setCountTotalBalance] = useState(0);
  const [countTotalDeposit, setCountTotalDeposit] = useState(0);
  const [countTotalLent, setCountTotalLent] = useState(0);
  const [countTotalOrder, setCountTotalOrder] = useState(0);
  const [countTotalBorrow, setCountTotalBorrow] = useState(0);

  const [priceETHUSD, setPriceETHUSD] = useState(0);
  const [priceUSDCUSD, setPriceUSDCUSD] = useState(0);
  const [borrowBalance, setTotalBorrow] = useState(0);


  // BALANCE
  const [ethBalance, setEthBalance] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [wethBalance, setWethBalance] = useState('0');

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userBorrows, setUserBorrows] = useState<Borrow[]>([]);

  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openIncreaseSizeDialog, setOpenIncreaseSizeDialog] = useState(false);
  const [openChangePairedPriceDialog, setOpenChangePairedPriceDialog] = useState(false);
  const [openChangeLimitPriceDialog, setOpenChangeLimitPriceDialog] = useState(false);

  const [expandedBorrow, setExpandedBorrow] = useState<number | null>(null);

  const [newLimitPrice, setNewLimitPrice] = useState(0);
  const [newPairedPrice, setNewPairedPrice] = useState(0);
  const [newSize, setNewSize] = useState(0);

  const totalDepositsETH = userOrders.filter(order => order.asset === 'ETH').reduce((sum, order) => sum + parseFloat(order.size), 0);
  const totalBorrowsETH = userBorrows.filter(borrow => borrow.asset === 'ETH').reduce((sum, borrow) => sum + parseFloat(borrow.size), 0);

  const totalDepositsUSDC = userOrders.filter(order => order.asset === 'USDC').reduce((sum, order) => sum + parseFloat(order.size), 0);
  const totalBorrowsUSDC = userBorrows.filter(borrow => borrow.asset === 'USDC').reduce((sum, borrow) => sum + parseFloat(borrow.size), 0);


  // Actions
  const withdraw = useWithdraw();
  const repay = useRepay();
  const changeBorrowable = useChangeBorrowable();
  const increaseSize = useIncreaseSize();
  const increaseSizeBorrow = useIncreaseSizeBorrow();
  const changeLimitPrice = useChangeLimitPrice();
  const changePairedPrice = useChangePairedPrice();

  const [currentEditingOrderId, setCurrentEditingOrderId] = useState<number | null>(null);

  const [openIncreaseSizeBorrowDialog, setOpenIncreaseSizeBorrowDialog] = useState(false);
  const [openRepayDialog, setOpenRepayDialog] = useState(false);
  const [repaySize, setRepaySize] = useState('');
  const [increaseBorrowSize, setIncreaseBorrowSize] = useState('');

  const [activeTab, setActiveTab] = useState('orders');



  useEffect(() => {
    const fetchEthPrice = async () => {
      const price = await getEthPrice();
      if (price) setPriceETHUSD(price);
    };

    const fetchUsdcPrice = async () => {
      const price = await getUSDCPrice();
      if (price) setPriceUSDCUSD(price);
    };

    fetchEthPrice();
    fetchUsdcPrice();
  }, []);

  const handleChangeTab = (event: any, newValue: React.SetStateAction<string>) => {
    setActiveTab(newValue);
  };

  let totalBalance: number = 0;
  let totalBorrow: number = 0;
  let totalDeposit: number = 0;

  if (!isNaN(parseFloat(wethBalance)) && !isNaN(parseFloat(usdcBalance)) && !isNaN(totalBorrowsETH) && !isNaN(totalBorrowsUSDC) && !isNaN(priceETHUSD) && !isNaN(priceUSDCUSD)) {
    totalBalance = parseFloat((parseFloat(wethBalance) * priceETHUSD + parseFloat(usdcBalance) * priceUSDCUSD).toFixed(2));
    totalBorrow = parseFloat(((totalBorrowsETH * priceETHUSD) + (totalBorrowsUSDC * priceUSDCUSD)).toFixed(2));
    totalDeposit = parseFloat(((totalDepositsETH * priceETHUSD) + (totalDepositsUSDC * priceUSDCUSD)).toFixed(2));
  } else {
    console.log("Error to fetch value");
  }



  const handleOpenIncreaseSizeBorrowDialog = () => {
    setOpenIncreaseSizeBorrowDialog(true);
  };

  const handleCloseIncreaseSizeBorrowDialog = () => {
    setOpenIncreaseSizeBorrowDialog(false);
  };

  const handleOpenRepayDialog = () => {
    setOpenRepayDialog(true);
  };

  const handleCloseRepayDialog = () => {
    setOpenRepayDialog(false);
  };

  const handleSubmitRepay = async () => {
    // Logique pour soumettre l'action "Repay"
    handleCloseRepayDialog();
  };

  const handleSubmitIncreaseSizeBorrow = async () => {
    // Logique pour soumettre l'action "Increase Size"
    handleCloseIncreaseSizeBorrowDialog();
  };


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentOrder(order); // Assurez-vous que cette fonction est définie
    setCurrentEditingOrderId(order.id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Fonctions pour ouvrir et fermer les dialogues
  const handleOpenIncreaseSizeDialog = () => {
    setOpenIncreaseSizeDialog(true);
    handleMenuClose();
  };

  const handleCloseIncreaseSizeDialog = () => {
    setOpenIncreaseSizeDialog(false);
  };

  const handleOpenChangePairedPriceDialog = () => {
    setOpenChangePairedPriceDialog(true);
    handleMenuClose();
  };

  const handleCloseChangePairedPriceDialog = () => {
    setOpenChangePairedPriceDialog(false);
  };

  const handleOpenChangeLimitPriceDialog = () => {
    setOpenChangeLimitPriceDialog(true);
    handleMenuClose();
  };

  const handleCloseChangeLimitPriceDialog = () => {
    setOpenChangeLimitPriceDialog(false);
  };
  const handleClickOpen = (order: Order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUsdcBalanceAndAllowance = async () => {
    if (signer && address) {
      const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, signer);
      const balance = await usdcContract.balanceOf(address);

      setUsdcBalance(Number(ethers.utils.formatUnits(balance, 18)).toFixed(2));
    }
  };
  const fetchWethBalanceAndAllowance = async () => {
    if (signer && address) {
      const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, signer);
      const balance = await wethContract.balanceOf(address);

      setWethBalance(Number(ethers.utils.formatUnits(balance, 18)).toFixed(2));
    }
  };

  useEffect(() => {
    fetchWethBalanceAndAllowance();
  }, [signer, address]);

  useEffect(() => {
    fetchUsdcBalanceAndAllowance();
  }, [signer, address]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTotalBalance((prevCount) => {
        const increment = totalBalance / 100; // Nombre d'incrément pour atteindre la valeur totale
        const newValue = prevCount + increment;
        // Arrête l'incrémentation lorsque la valeur atteint totalBalance
        if (newValue >= totalBalance) {
          clearInterval(interval);
          return totalBalance;
        }
        return newValue;
      });
    }, 50); // Intervalle de mise à jour (ms)

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [totalBalance]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTotalDeposit((prevCount) => {
        const increment = totalDeposit / 100; // Nombre d'incrément pour atteindre la valeur totale
        const newValue = prevCount + increment;
        // Arrête l'incrémentation lorsque la valeur atteint totalBalance
        if (newValue >= totalDeposit) {
          clearInterval(interval);
          return totalDeposit;
        }
        return newValue;
      });
    }, 50); // Intervalle de mise à jour (ms)

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [totalDeposit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTotalBorrow((prevCount) => {
        const increment = totalBorrow / 100; // Nombre d'incrément pour atteindre la valeur totale
        const newValue = prevCount + increment;
        // Arrête l'incrémentation lorsque la valeur atteint totalBalance
        if (newValue >= totalBorrow) {
          clearInterval(interval);
          return totalBorrow;
        }
        return newValue;
      });
    }, 50); // Intervalle de mise à jour (ms)

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [totalBorrow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTotalOrder((prevCount) => {
        const nbOrders = userOrders.length;
        const increment = nbOrders / 100;
        const newValue = prevCount + increment;
        if (newValue >= nbOrders) {
          clearInterval(interval);
          return nbOrders;
        }
        return newValue;
      });
    }, 50); // Intervalle de mise à jour (ms)

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [totalBorrow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTotalLent((prevCount) => {
        const nbBorrow = userBorrows.length;
        const increment = nbBorrow / 100; // Nombre d'incrément pour atteindre la valeur totale
        const newValue = prevCount + increment;
        // Arrête l'incrémentation lorsque la valeur atteint totalBalance
        if (newValue >= nbBorrow) {
          clearInterval(interval);
          return nbBorrow;
        }
        return newValue;
      });
    }, 50); // Intervalle de mise à jour (ms)

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, [totalBorrow]);


  const handleLimitPriceChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setNewLimitPrice(0);
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setNewLimitPrice(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePairedPriceChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setNewPairedPrice(0);
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setNewPairedPrice(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSizeChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setNewSize(0);
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setNewSize(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepay = async (positionId: number, repaidQuantity: string) => {
    try {
      await repay(positionId, repaidQuantity);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleInceaseSizeBorrow = async (positionId: number, repaidQuantity: string) => {
    try {
      await repay(positionId, repaidQuantity);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleWithdraw = async (orderId: number, quantity: string) => {
    try {
      await withdraw(orderId, quantity);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const toggleBorrowable = async (index: number) => {
    const order = userOrders[index];
    if (order) {
      await changeBorrowable(order.id, !order.isBorrowable);
      setUserOrders(orders =>
          orders.map((o, i) =>
              i === index ? { ...o, isBorrowable: !o.isBorrowable } : o
          )
      );
    }
  };

  const handleSubmitIncreaseSize = async (newSize: string, price: string, pairedPrice: string, isBuyOrder: string, isBorrowable: boolean) => {
    try {

      if (isBuyOrder === 'BUY')
      {
        await increaseSize(newSize, price, pairedPrice, true, isBorrowable);
      } else
      {
        await increaseSize(newSize, price, pairedPrice, false, isBorrowable);
      }

    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleSubmitChangeLimitPrice = async () => {
    if (currentEditingOrderId !== null) {
      try {
        await changeLimitPrice(currentEditingOrderId, String(newLimitPrice));
      } catch (error) {
        console.error("Error : ", error);
      }
    }
  };

  const handleSubmitChangePairedPrice = async () => {
    if (currentEditingOrderId !== null) {
      try {
        await changePairedPrice(currentEditingOrderId, String(newPairedPrice));
      } catch (error) {
        console.error("Error : ", error);
      }
    }
  };


  useEffect(() => {
    const loadUserData = async () => {
      if (address) {
        try {
          const depositIds = await orderbookContract.getUserDepositIds(address);
          let ordersDetails = [];
          for (const id of depositIds) {
            const order = await orderbookContract.orders(id);
            if (!ethers.BigNumber.from(order.quantity).isZero()) {
              const formattedOrder = {
                id: id,
                order: order.isBuyOrder ? 'BUY' : 'SELL',
                size: Number(ethers.utils.formatUnits(order.quantity, 18)).toFixed(2),
                asset: order.isBuyOrder ? 'USDC' : 'ETH',
                nextLimitPrice: Number(ethers.utils.formatUnits(order.price, 18)).toFixed(2),
                pairedPrice: Number(ethers.utils.formatUnits(order.pairedPrice, 18)).toFixed(2),
                isBorrowable: order.isBorrowable,
                lendRatio: 0,
                apy: 0
              };
              ordersDetails.push(formattedOrder);
            }
          }
          setUserOrders(ordersDetails);

          const borrowFromIds = await orderbookContract.getUserBorrowFromIds(address);
          let borrowsDetails = [];
          for (const id of borrowFromIds) {
            const borrow = await orderbookContract.positions(id);
           if (!ethers.BigNumber.from(borrow.borrowedAssets).isZero()) {
              const formattedBorrow = {
                id: id,
                asset: 'ETH',
                size: Number(ethers.utils.formatUnits(borrow.borrowedAssets, 18)).toFixed(2),
                closingPrice: Number(ethers.utils.formatUnits(0, 18)).toFixed(2),
                apy: 0
              };

              console.log("formated:" +id);
              borrowsDetails.push(formattedBorrow);
            }
          }
          setUserBorrows(borrowsDetails);

        } catch (error) {
          console.error("Error : ", error);
        }
      } else {
        setUserOrders([]);
        setUserBorrows([]);
      }
    };

    loadUserData();
  }, [address, orderbookContract]);



  return (
      <>
        <Card sx={{maxWidth: '1500px', margin: 'auto', background: 'transparent', boxShadow: 'none',
          border: 'none'}}>
          <CardContent
              sx={{
                width: '100%',
                p: '1.5rem 2rem 0rem 2rem',
                mb: '2rem',
              }}
          >

            <Box sx={{ display: 'flex', gap: '20px', border: '2px solid #34363e', padding: '10px', borderRadius: '10px', marginBottom: '2rem', background: '#131518' }}>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', '&:hover': { backgroundColor: 'transparent' } }}>
                <Typography variant="subtitle1">Total Deposit value</Typography>
                <Typography variant="subtitle1">$ {Math.round(countTotalDeposit).toLocaleString('en-US')}</Typography>
              </Box>
              <Box sx={{ width: '2px', background: '#34363e' }} />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', '&:hover': { backgroundColor: 'transparent' } }}>
                <Typography variant="subtitle1">Total Borrow value</Typography>
                <Typography variant="subtitle1">$ {Math.round(countTotalBorrow).toLocaleString('en-US')}</Typography>
              </Box>
              <Box sx={{ width: '2px', background: '#34363e' }} />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', '&:hover': { backgroundColor: 'transparent' } }}>
                <Typography variant="subtitle1">Available to Borrow</Typography>
                <Typography variant="subtitle1">$ {Math.round(countTotalBalance).toLocaleString('en-US')}</Typography>
              </Box>
             {/* <Box sx={{ width: '2px', background: '#34363e' }} /> */}
              {/* <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', '&:hover': { backgroundColor: 'transparent' } }}>
                <Typography variant="subtitle1">Orders</Typography>
                <Typography variant="subtitle1">{Math.round(countTotalOrder).toLocaleString('en-US')}</Typography>
              </Box>
              <Box sx={{ width: '2px', background: '#34363e' }} />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', '&:hover': { backgroundColor: 'transparent' } }}>
                <Typography variant="subtitle1">Borrow</Typography>
                <Typography variant="subtitle1">{Math.round(countTotalLent).toLocaleString('en-US')}</Typography>
              </Box> */}
            </Box>

            <Tabs
                  value={activeTab}
                  onChange={handleChangeTab}
                  aria-label="SwitchTabs"
                  sx={{
                    width: '300px',
                    borderRadius: '10px',
                    border: '2px solid #131518',
                    '.MuiTabs-flexContainer': {
                      backgroundColor: '#131518',
                    },
                    '.MuiTab-root': {
                      color: 'white',
                      flexGrow: 1,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#35353b',
                        color: 'white',
                      },
                    },
                    '.MuiTabs-indicator': {
                      backgroundColor: 'transparent',
                    },
                  }}
              >
                <Tab label="Orders" value="orders" style={{ borderRadius: '8px' }} />
                <Tab label="Borrowing" value="borrows" style={{ borderRadius: '8px' }} />
              </Tabs>
          </CardContent>

              {activeTab === 'orders' && (
                  <Card sx={{maxWidth: '1500px', margin: 'auto', background: 'transparent', boxShadow: 'none',
                    border: 'none'}}>
                    <CardContent
                        sx={{
                          width: '100%',
                          p: '0rem 2rem 1.5rem 2rem',
                          mb: '2rem',
                        }}
                    >
                      <Box>
                        {/*<Typography variant="h4" style={{color: 'white'}}>My Orders</Typography> */}
                        <Grid
                            container
                            mt="2.5rem"
                            mb="1rem"
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="wrap"
                        >
                          <TableContainer
                              sx={{mt: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '2px solid #34363e'}}>
                            <Table
                                aria-label="Markets table"
                                sx={{borderCollapse: 'initial', backgroundColor: '#131518'}}
                            >
                              <TableHead>
                                <TableRow sx={{height: '2.625rem'}}>
                                  <SizableTableCell  width="100px" style={{color: 'white'}}>
                                    Assets
                                  </SizableTableCell>
                                  <SizableTableCell  width="100px" style={{color: 'white'}}>
                                    Collateral
                                  </SizableTableCell>
                                  <SizableTableCell width="100px"  style={{color: 'white'}}>
                                    Network
                                  </SizableTableCell>
                                  <SizableTableCell  width="80px" style={{color: 'white'}}>
                                    Size
                                  </SizableTableCell>
                                  <SizableTableCell width="100px"  style={{color: 'white'}}>
                                    Limit Price
                                  </SizableTableCell>
                                  <SizableTableCell width="100px" style={{color: 'white'}}>
                                    Paired Price
                                  </SizableTableCell>
                                  <SizableTableCell width="100px"  style={{color: 'white'}}>
                                    Lend ratio
                                  </SizableTableCell>
                                  <SizableTableCell width="80px"  style={{color: 'white'}}>
                                    APY
                                  </SizableTableCell>
                                  <SizableTableCell width="100px"  style={{color: 'white'}}>
                                    Borrowable
                                  </SizableTableCell>
                                  <SizableTableCell width="150px"  style={{color: 'white'}}>

                                  </SizableTableCell>
                                </TableRow>
                              </TableHead>
                              {userOrders.map((order, index) => (
                                  <React.Fragment key={index}>
                                    <tr key={index}>
                                      {userOrders.length > 0 ? (
                                          <>
                                            <TableBody >
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
                                              >
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center', width:'100px'}}>
                                                    {order.asset === 'ETH' ? (
                                                        <>
                                                          <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                          <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                                        </>
                                                    )}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' , width:'100px'}}>
                                                    {order.asset !== 'ETH' ? (
                                                        <>
                                                          <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                          <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                                        </>
                                                    )}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' , width:'120px'}}>
                                                    <img src={BlastIcon} alt="BLAST"
                                                         style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                                                    <Typography variant="body2" style={{color: 'white', display: 'inline'}}>BLAST</Typography>
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center', color: 'white' , width:'100px'}}>
                                                    {order.size} {order.asset}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'120px'}}>
                                                    {order.nextLimitPrice}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'120px'}}>
                                                    {order.pairedPrice}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'100px'}}>
                                                    {order.lendRatio}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' , color: 'white' , width:'100px'}}>
                                                    {order.apy}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' , color: 'white' , width:'100px'}}>
                                                    <Switch
                                                        checked={order.isBorrowable}
                                                        onChange={() => toggleBorrowable(index)}/>
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' }}>
                                                    <button
                                                        className="btn btn-primary btn-sm bg-[#000000]"
                                                        onClick={() => handleWithdraw(order.id, order.size)}
                                                    >
                                                      Withdraw
                                                    </button>
                                                    <Button
                                                        aria-controls="simple-menu"
                                                        aria-haspopup="true"
                                                        onClick={(e) => handleMenuClick(e, order)}
                                                    >
                                                      •••
                                                    </Button>
                                                    <Menu
                                                        id="simple-menu"
                                                        anchorEl={menuAnchorEl}
                                                        keepMounted
                                                        open={Boolean(menuAnchorEl)}
                                                        onClose={handleMenuClose}
                                                        MenuListProps={{
                                                          style: {
                                                            backgroundColor: '#191b1f',
                                                            color: 'white',
                                                          },
                                                        }}
                                                    >
                                                      <MenuItem onClick={handleOpenIncreaseSizeDialog}>Increase Size</MenuItem>
                                                      <MenuItem onClick={handleOpenChangePairedPriceDialog}>Change Paired Price</MenuItem>
                                                      <MenuItem onClick={handleOpenChangeLimitPriceDialog}>Change Limit Price</MenuItem>
                                                    </Menu>
                                                    <Dialog open={openIncreaseSizeDialog} onClose={handleCloseIncreaseSizeDialog}>
                                                      <DialogTitle style={{backgroundColor: '#191b1f', color: 'white'}}>Increase
                                                        Size</DialogTitle>
                                                      <DialogContent style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="Increse Size"
                                                            type="number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={increaseSize}
                                                            onChange={handleSizeChange}
                                                            InputLabelProps={{
                                                              style: {color: 'white'}
                                                            }}
                                                            InputProps={{
                                                              style: {color: 'white'},
                                                            }}/>
                                                      </DialogContent>
                                                      <DialogActions style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={handleCloseIncreaseSizeDialog}>Cancel</Button>
                                                        {/* <Button style={{ backgroundColor: '#191b1f', color: 'white' }} onClick={() => handleSubmitIncreaseSize()}>Increase</Button> */}
                                                      </DialogActions>
                                                    </Dialog>

                                                    <Dialog open={openChangeLimitPriceDialog} onClose={handleCloseChangeLimitPriceDialog}>
                                                      <DialogTitle style={{backgroundColor: '#191b1f', color: 'white'}}>Change Limit
                                                        Price</DialogTitle>
                                                      <DialogContent style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="Change Limit Price"
                                                            type="number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={newLimitPrice}
                                                            onChange={handleLimitPriceChange}
                                                            InputLabelProps={{
                                                              style: {color: 'white'}
                                                            }}
                                                            InputProps={{
                                                              style: {color: 'white'},
                                                            }}/>
                                                      </DialogContent>
                                                      <DialogActions style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={handleCloseChangeLimitPriceDialog}>Cancel</Button>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={() => handleSubmitChangeLimitPrice()}>Change Price</Button>
                                                      </DialogActions>
                                                    </Dialog>

                                                    <Dialog open={openChangePairedPriceDialog} onClose={handleCloseChangePairedPriceDialog}>
                                                      <DialogTitle style={{backgroundColor: '#191b1f', color: 'white'}}>Change Paired
                                                        Price</DialogTitle>
                                                      <DialogContent style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="Change Paired Price "
                                                            type="number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={newPairedPrice}
                                                            onChange={handlePairedPriceChange}
                                                            InputLabelProps={{
                                                              style: {color: 'white'}
                                                            }}
                                                            InputProps={{
                                                              style: {color: 'white'},
                                                            }}/>
                                                      </DialogContent>
                                                      <DialogActions style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={handleCloseChangePairedPriceDialog}>Cancel</Button>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={() => handleSubmitChangePairedPrice()}>Change Price</Button>
                                                      </DialogActions>
                                                    </Dialog>
                                                  </Box>
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </>
                                      ) : (
                                          <p className="text-[white]">No orders</p>
                                      )}


                                    </tr>
                                  </React.Fragment>

                              ))}

                            </Table>
                          </TableContainer>

                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
              )}
              {activeTab === 'borrows' && (
                  <Card sx={{maxWidth: '1500px', margin: 'auto', background: 'transparent', boxShadow: 'none',
                    border: 'none'}}>
                    <CardContent
                        sx={{
                          width: '100%',
                          p: '0rem 2rem 1.5rem 2rem',
                          mb: '2rem',
                        }}
                    >
                      <Box>
                        {/*<Typography variant="h4" style={{color: 'white'}}>My Borrows</Typography> */}
                        <Grid
                            container
                            mt="2.5rem"
                            mb="1rem"
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="wrap"
                        >
                          <TableContainer
                              sx={{mt: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '2px solid #34363e'}}>
                            <Table
                                aria-label="Markets table"
                                sx={{borderCollapse: 'initial', backgroundColor: '#131518'}}
                            >
                              <TableHead>
                                <TableRow sx={{height: '2.625rem'}}>
                                  <SizableTableCell  width="250px" style={{color: 'white'}}>
                                    Borrowed assets
                                  </SizableTableCell>
                                  <SizableTableCell  width="250px" style={{color: 'white'}}>
                                    Network
                                  </SizableTableCell>
                                  <SizableTableCell  width="250px" style={{color: 'white'}}>
                                    Size
                                  </SizableTableCell>
                                  <SizableTableCell width="250px"  style={{color: 'white'}}>
                                    Closing Price
                                  </SizableTableCell>
                                  <SizableTableCell width="250px"  style={{color: 'white'}}>
                                    APY
                                  </SizableTableCell>
                                  <SizableTableCell width="250px"  style={{color: 'white'}}>

                                  </SizableTableCell>
                                </TableRow>
                              </TableHead>
                              {userBorrows.map((borrow, index) => (
                                  <React.Fragment key={index}>
                                    <tr key={index}>
                                      {userBorrows.length > 0 ? (
                                          <>
                                            <TableBody >
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
                                              >
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center', width:'200px'}}>
                                                    {borrow.asset === 'ETH' ? (
                                                        <>
                                                          <img src={ethIcon} alt="ETH" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>ETH</Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                          <img src={usdcIcon} alt="USDC" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                                          <Typography variant="body2" style={{ color: 'white', display: 'inline' }}>USDC</Typography>
                                                        </>
                                                    )}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' , width:'230px'}}>
                                                    <img src={BlastIcon} alt="BLAST"
                                                         style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                                                    <Typography variant="body2" style={{color: 'white', display: 'inline'}}>BLAST</Typography>
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center', color: 'white' , width:'240px'}}>
                                                    {borrow.size} {borrow.asset}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'210px'}}>
                                                    {borrow.closingPrice}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'180px'}}>
                                                    {borrow.apy}
                                                  </Box>
                                                </TableCell>

                                                <TableCell align="left">
                                                  <Box sx={{display: 'flex', alignItems: 'center' }}>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                      <button className="btn btn-primary btn-sm bg-[#000000] mr-2"
                                                              onClick={handleOpenIncreaseSizeBorrowDialog}>Increase
                                                      </button>
                                                      <button className="btn btn-primary btn-sm bg-[#000000]"
                                                              onClick={handleOpenRepayDialog}>Repay
                                                      </button>
                                                    </div>
                                                    <Dialog open={openIncreaseSizeBorrowDialog}
                                                            onClose={handleCloseIncreaseSizeBorrowDialog}>
                                                      <DialogTitle style={{backgroundColor: '#191b1f', color: 'white'}}>Increase
                                                        Size</DialogTitle>
                                                      <DialogContent style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="Increase Size"
                                                            type="number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={newLimitPrice}
                                                            onChange={handleSubmitChangeLimitPrice}
                                                            InputLabelProps={{
                                                              style: {color: 'white'}
                                                            }}
                                                            InputProps={{
                                                              style: {color: 'white'},
                                                            }}/>
                                                      </DialogContent>
                                                      <DialogActions style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}>Cancel</Button>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={() => handleSubmitIncreaseSizeBorrow()}>Increase Size</Button>
                                                      </DialogActions>
                                                    </Dialog>
                                                    <Dialog open={openRepayDialog} onClose={handleCloseRepayDialog}>
                                                      <DialogTitle style={{backgroundColor: '#191b1f', color: 'white'}}>Repay</DialogTitle>
                                                      <DialogContent style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="Repay"
                                                            type="number"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={newLimitPrice}
                                                            onChange={handleLimitPriceChange}
                                                            InputLabelProps={{
                                                              style: {color: 'white'}
                                                            }}
                                                            InputProps={{
                                                              style: {color: 'white'},
                                                            }}/>
                                                      </DialogContent>
                                                      <DialogActions style={{backgroundColor: '#191b1f', color: 'white'}}>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={handleCloseChangeLimitPriceDialog}>Cancel</Button>
                                                        <Button style={{backgroundColor: '#191b1f', color: 'white'}}
                                                                onClick={() => handleSubmitRepay()}>Repay</Button>
                                                      </DialogActions>
                                                    </Dialog>
                                                  </Box>
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </>
                                      ) : (
                                          <p className="text-[white]">No borrow</p>
                                      )}


                                    </tr>
                                  </React.Fragment>

                              ))}

                            </Table>
                          </TableContainer>

                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
              )}
        </Card>

        <Card sx={{maxWidth: '1500px', margin: 'auto', background: 'transparent', boxShadow: 'none',
          border: 'none'}}>
          <CardContent
              sx={{
                width: '100%',
                p: '0rem 2rem 1.5rem 2rem',
                mb: '2rem',
              }}
          >
            <Box>
              <Typography variant="h4" style={{color: 'white'}}>My Positions</Typography>
              <Grid
                  container
                  mt="2.5rem"
                  mb="1rem"
                  justifyContent="space-between"
                  alignItems="center"
                  wrap="wrap"
              >
                <TableContainer
                    sx={{mt: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '2px solid #34363e'}}>
                  <Table
                      aria-label="Markets table"
                      sx={{borderCollapse: 'initial', backgroundColor: '#131518'}}
                  >
                    <TableHead>
                      <TableRow sx={{height: '2.625rem'}}>
                        <SizableTableCell  width="200px" style={{color: 'white'}}>
                          Assets
                        </SizableTableCell>
                        <SizableTableCell  width="200px" style={{color: 'white'}}>
                          Network
                        </SizableTableCell>
                        <SizableTableCell  width="200px" style={{color: 'white'}}>
                          Total Deposits
                        </SizableTableCell>
                        <SizableTableCell width="200px"  style={{color: 'white'}}>
                          Total Lent
                        </SizableTableCell>
                        <SizableTableCell width="200px"  style={{color: 'white'}}>
                          Used as Colateral
                        </SizableTableCell>
                        <SizableTableCell width="200px"  style={{color: 'white'}}>
                          Available assets
                        </SizableTableCell>
                        <SizableTableCell width="200px"  style={{color: 'white'}}>
                          Safety Margin
                        </SizableTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody >
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
                      >
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center', width:'200px'}}>
                            <img src={usdcIcon} alt="USDC" style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                            <Typography variant="body2" style={{color: 'white', display: 'inline'}}>USDC</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center' , width:'230px'}}>
                            <img src={BlastIcon} alt="BLAST"
                                 style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                            <Typography variant="body2" style={{color: 'white', display: 'inline'}}>BLAST</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'210px'}}>
                            {totalDepositsUSDC.toFixed(2)} USDC
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'180px'}}>
                            {totalBorrowsUSDC.toFixed(2)} USDC
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'230px'}}>
                            5000
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'200px'}}>
                            Deposits
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'200px'}}>
                            5%
                          </Box>
                        </TableCell>
                      </TableRow>
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
                      >
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center', width:'200px'}}>
                            <img src={ethIcon} alt="ETH" style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                            <Typography variant="body2" style={{color: 'white', display: 'inline'}}>ETH</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center' , width:'230px'}}>
                            <img src={BlastIcon} alt="BLAST"
                                 style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                            <Typography variant="body2" style={{color: 'white', display: 'inline'}}>BLAST</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'210px'}}>
                            {totalDepositsETH.toFixed(2)} ETH
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'180px'}}>
                            {totalBorrowsETH.toFixed(2)} ETH
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'230px'}}>
                            5000
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'200px'}}>
                            Deposits
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{display: 'flex', alignItems: 'center',  color: 'white' , width:'200px'}}>
                            5%
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

              </Grid>
            </Box>
          </CardContent>
        </Card>

      </>



  );
}

