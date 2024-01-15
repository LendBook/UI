import "../asserts/scss/custom.scss";
import {Accordion, AccordionSummary, Switch, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {orderbookContract} from "../contracts";
import {useAccount} from "wagmi";
import {ethers} from "ethers";
import {useWithdraw} from "../hooks/useWithdraw";
import {useRepay} from "../hooks/useRepay";
import {useChangeBorrowable} from "../hooks/useChangeBorrowable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import useIncreaseSize from "../hooks/useIncreaseSize";
import useChangeLimitPrice from "../hooks/useChangeLimitPrice";
import useChangePairedPrice from "../hooks/useChangePairedPrice";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useIncreaseSizeBorrow from "../hooks/useIncreaseSizeBorrow";


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

  const {address} = useAccount();

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
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="my-orders">
          <h2>My Orders</h2>
          <div className="border-b border-white mt-2 "></div>
          <br/>
            <table>
              <thead>
              <tr>
                <th>Orders</th>
                <th>Size</th>
                <th>Limit Price</th>
                <th>Paired Price</th>
                <th>Lend ratio</th>
                <th>APY</th>
                <th>Borrowable</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {userOrders.map((order, index) => (
                  <React.Fragment key={index}>
                  <tr key={index}>
                    {userOrders.length > 0 ? (
                        <>
                          <td>{order.order}</td>
                          <td>{order.size} {order.asset}</td>
                          <td>{order.nextLimitPrice}</td>
                          <td>{order.pairedPrice}</td>
                          <td>{order.lendRatio}</td>
                          <td>{order.apy}</td>
                          <td><Switch
                              checked={order.isBorrowable}
                              onChange={() => toggleBorrowable(index)}
                          /></td>
                        </>
              ) : (
                        <p className="text-[white]">No orders</p>
              )}

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className="btn btn-primary btn-sm bg-[#050b4d]"
                            onClick={() => handleWithdraw(order.id, order.size)}
                        >
                          Withdraw
                        </button>
                        {/*<Button
                            onClick={() => handleAccordionChange(order.id)}
                        >
                          <ExpandMoreIcon />
                        </Button>*/}
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
                                backgroundColor: '#161617',
                                color: 'white',
                              },
                            }}
                        >
                          <MenuItem onClick={handleOpenIncreaseSizeDialog}>Increase Size</MenuItem>
                          <MenuItem onClick={handleOpenChangePairedPriceDialog}>Change Paired Price</MenuItem>
                          <MenuItem onClick={handleOpenChangeLimitPriceDialog}>Change Limit Price</MenuItem>
                        </Menu>
                        <Dialog open={openIncreaseSizeDialog} onClose={handleCloseIncreaseSizeDialog}>
                          <DialogTitle style={{ backgroundColor: '#161617', color: 'white' }}>Increase Size</DialogTitle>
                          <DialogContent style={{ backgroundColor: '#161617', color: 'white' }}>
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
                                  style: { color: 'white' }
                                }}
                                InputProps={{
                                  style: { color: 'white' },
                                }}

                            />
                          </DialogContent>
                          <DialogActions style={{ backgroundColor: '#161617', color: 'white' }}>
                            <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={handleCloseIncreaseSizeDialog}>Cancel</Button>
                            {/* <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={() => handleSubmitIncreaseSize()}>Increase</Button> */}
                          </DialogActions>
                        </Dialog>

                        <Dialog open={openChangeLimitPriceDialog} onClose={handleCloseChangeLimitPriceDialog}>
                          <DialogTitle style={{ backgroundColor: '#161617', color: 'white' }}>Change Limit Price</DialogTitle>
                          <DialogContent style={{ backgroundColor: '#161617', color: 'white' }}>
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
                                  style: { color: 'white' }
                                }}
                                InputProps={{
                                  style: { color: 'white' },
                                }}

                            />
                          </DialogContent>
                          <DialogActions style={{ backgroundColor: '#161617', color: 'white' }}>
                            <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={handleCloseChangeLimitPriceDialog}>Cancel</Button>
                            <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={() => handleSubmitChangeLimitPrice()}>Change Price</Button>
                          </DialogActions>
                        </Dialog>

                        <Dialog open={openChangePairedPriceDialog} onClose={handleCloseChangePairedPriceDialog}>
                          <DialogTitle style={{ backgroundColor: '#161617', color: 'white' }}>Change Paired Price</DialogTitle>
                          <DialogContent style={{ backgroundColor: '#161617', color: 'white' }}>
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
                                  style: { color: 'white' }
                                }}
                                InputProps={{
                                  style: { color: 'white' },
                                }}
                            />
                          </DialogContent>
                          <DialogActions style={{ backgroundColor: '#161617', color: 'white' }}>
                            <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={handleCloseChangePairedPriceDialog}>Cancel</Button>
                            <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={() => handleSubmitChangePairedPrice()}>Change Price</Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                  </React.Fragment>
              ))}
              </tbody>
            </table>
        </div>
        <br/>
        <div className="my-borrows">
          <h2>My Borrows</h2>
          <div className="border-b border-white mt-2 "></div>
          <br/>
          <table>
            <thead>
            <tr>
                    <th>Borrowed assets</th>
                    <th>Size</th>
                    <th>Closing Price</th>
                    <th>APY</th>
                    <th></th>
            </tr>
            </thead>
            <tbody>
            {userBorrows.map((borrow, index) => (
                <React.Fragment key={index}>
                  <tr key={index}>
                    {userBorrows.length > 0 ? (
                        <>
                          <td>{borrow.asset}</td>
                          <td>{borrow.size} {borrow.asset}</td>
                          <td>{borrow.closingPrice}</td>
                          <td>{borrow.apy}</td>
                          <td>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                              <button className="btn btn-primary btn-sm bg-[#050b4d] mr-2" onClick={handleOpenIncreaseSizeBorrowDialog}>Increase Size</button>
                              <button className="btn btn-primary btn-sm bg-[#050b4d]" onClick={handleOpenRepayDialog}>Repay</button>
                            </div>
                            <Dialog open={openIncreaseSizeBorrowDialog} onClose={handleCloseIncreaseSizeBorrowDialog}>
                              <DialogTitle style={{ backgroundColor: '#161617', color: 'white' }}>Increase Size</DialogTitle>
                              <DialogContent style={{ backgroundColor: '#161617', color: 'white' }}>
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
                                      style: { color: 'white' }
                                    }}
                                    InputProps={{
                                      style: { color: 'white' },
                                    }}
                                />
                              </DialogContent>
                              <DialogActions style={{ backgroundColor: '#161617', color: 'white' }}>
                                <Button style={{ backgroundColor: '#161617', color: 'white' }}>Cancel</Button>
                                <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={() => handleSubmitIncreaseSizeBorrow()}>Increase Size</Button>
                              </DialogActions>
                            </Dialog>
                            <Dialog open={openRepayDialog} onClose={handleCloseRepayDialog}>
                              <DialogTitle style={{ backgroundColor: '#161617', color: 'white' }}>Repay</DialogTitle>
                              <DialogContent style={{ backgroundColor: '#161617', color: 'white' }}>
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
                                      style: { color: 'white' }
                                    }}
                                    InputProps={{
                                      style: { color: 'white' },
                                    }}
                                />
                              </DialogContent>
                              <DialogActions style={{ backgroundColor: '#161617', color: 'white' }}>
                                <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={handleCloseChangeLimitPriceDialog}>Cancel</Button>
                                <Button style={{ backgroundColor: '#161617', color: 'white' }} onClick={() => handleSubmitRepay()}>Repay</Button>
                              </DialogActions>
                            </Dialog>
                          </td>
                        </>
                    ) : (
                        <p className="text-[white]">No borrows</p>
                    )}
                  </tr>
                  <tr>
                    {expandedBorrow === borrow.id && (
                        <tr style={{backgroundColor: '#2a2a2a'}}>
                          <td colSpan={8}>
                            <Accordion expanded>
                              <AccordionDetails style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                backgroundColor: '#2a2a2a'
                              }}>
                                <TextField
                                    label="Increase Size"
                                    variant="outlined"
                                    margin="normal"
                                    type="number"
                                    InputLabelProps={{style: {color: 'white'}}}
                                    InputProps={{style: {color: 'white'}}}
                                    style={{backgroundColor: '#2a2a2a'}}/>
                                <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                                  <button className="btn btn-primary btn-sm bg-[#050b4d]">
                                    Submit
                                  </button>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </td>
                        </tr>
                    )}
                  </tr>
                </React.Fragment>
            ))}
            </tbody>
          </table>
        </div>
        <br/>
        <div className="my-metrics">
          <h2>My Safety Margins</h2>
          <div className="border-b border-white mt-2 "></div>
          <br/>
          <table>
            <thead>
            <tr>
              <th>Assets</th>
              <th>Total Deposits</th>
              <th>Total Lent</th>
              <th>Used as Colateral</th>
              <th>Available assets</th>
              <th>Safety Margin</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>ETH</td>
              <td>{totalDepositsETH.toFixed(2)} ETH</td>
              <td>{totalBorrowsETH.toFixed(2)} ETH</td>
              <td>5000</td>
              <td>Deposits</td>
              <td>5%</td>
            </tr>
            <tr>
              <td>USDC</td>
              <td>{totalDepositsUSDC.toFixed(2)} USDC</td>
              <td>{totalBorrowsUSDC.toFixed(2)} USDC</td>
              <td>5000</td>
              <td>Deposits</td>
              <td>5%</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

