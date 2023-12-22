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

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [expandedBorrow, setExpandedBorrow] = useState<number | null>(null);
  const [borrowableStates, setBorrowableStates] = useState(userOrders.map(() => true));

  const [newLimitPrice, setNewLimitPrice] = useState(0);
  const [newPairedPrice, setNewPairedPrice] = useState(0);
  const [newSize, setNewSize] = useState(0);

  // Actions
  const withdraw = useWithdraw();
  const repay = useRepay();
  const changeBorrowable = useChangeBorrowable();
  const increaseSize = useIncreaseSize();
  const changeLimitPrice = useChangeLimitPrice();
  const changePairedPrice = useChangePairedPrice();

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

  const handleAccordionChange = (orderId: number) => {
    setExpandedOrder((prev) => (prev !== orderId ? orderId : null));
  };

  const handleAccordionChangeBorrow = (orderId: number) => {
    setExpandedBorrow((prev) => (prev !== orderId ? orderId : null));
  };

  const handleRepay = async (positionId: number, repaidQuantity: string) => {
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

  const handleSubmitChangeLimitPrice = async (orderId: number, price: string) => {
    try {
      console.log(orderId);
      console.log(price);
      await changeLimitPrice(orderId, price);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleSubmitChangePairedPrice = async (orderId: number, price: string) => {
    try {
      console.log(orderId);
      console.log(price);
      await changePairedPrice(orderId, price);
    } catch (error) {
      console.error("Error : ", error);
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
                size: ethers.utils.formatUnits(order.quantity, 18),
                asset: order.isBuyOrder ? 'USDC' : 'ETH',
                nextLimitPrice: ethers.utils.formatUnits(order.price, 18),
                pairedPrice: ethers.utils.formatUnits(order.pairedPrice, 18),
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
                size: ethers.utils.formatUnits(borrow.borrowedAssets, 18),
                closingPrice: ethers.utils.formatUnits(0, 18),
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
                        <Button
                            onClick={() => handleAccordionChange(order.id)}
                        >
                          <ExpandMoreIcon />
                        </Button>
                      </div>
                    </td>
                  </tr>
                    {expandedOrder === order.id && (
                        <tr style={{ backgroundColor: '#161617' }}>
                          <td colSpan={8}>
                            <Accordion expanded>
                              <AccordionDetails style={{ display: 'flex', flexDirection: 'row', gap: '10px', backgroundColor: '#161617'}}>
                                <div style={{ flex: 1 }}>
                                  <TextField
                                      label="Increase Size"
                                      variant="outlined"
                                      margin="normal"
                                      type="number"
                                      value={newSize}
                                      onChange={handleSizeChange}
                                      InputLabelProps={{ style: { color: 'white' }}}
                                      InputProps={{ style: { color: 'white' }}}
                                      style={{ backgroundColor: '#2a2a2a'}}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button
                                        className="btn btn-primary btn-sm bg-[#050b4d]"
                                        onClick={() => handleSubmitIncreaseSize(String(newSize), order.nextLimitPrice, order.pairedPrice, order.order, order.isBorrowable)}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <TextField
                                      label="Change Limit Price"
                                      variant="outlined"
                                      margin="normal"
                                      type="number"
                                      value={newLimitPrice}
                                      onChange={handleLimitPriceChange}
                                      InputLabelProps={{ style: { color: 'white' }}}
                                      InputProps={{ style: { color: 'white' }}}
                                      style={{ backgroundColor: '#2a2a2a' }}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button
                                        className="btn btn-primary btn-sm bg-[#050b4d]"
                                        onClick={() => handleSubmitChangeLimitPrice(order.id, String(newLimitPrice))}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <TextField
                                      label="Change Paired Price"
                                      variant="outlined"
                                      margin="normal"
                                      type="number"
                                      value={newPairedPrice}
                                      onChange={handlePairedPriceChange}
                                      InputLabelProps={{ style: { color: 'white' }}}
                                      InputProps={{ style: { color: 'white' }}}
                                      style={{ backgroundColor: '#2a2a2a'}}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button
                                        className="btn btn-primary btn-sm bg-[#050b4d]"
                                        onClick={() => handleSubmitChangePairedPrice(order.id, String(newPairedPrice))}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </td>
                        </tr>
                    )}



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
                              <button
                                  className="btn btn-primary btn-sm bg-[#050b4d]"
                                  onClick={() => handleRepay(borrow.id, borrow.size.toString())}
                              >
                                Repay
                              </button>
                              <Button
                                  onClick={() => handleAccordionChangeBorrow(borrow.id)}
                              >
                                <ExpandMoreIcon/>
                              </Button>
                            </div>
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
              <th>Deposits</th>
              <th>Lent</th>
              <th>Used as Colateral</th>
              <th>Available assets</th>
              <th>Safety Margin</th>
            </tr>
            </thead>
          </table>
        </div>
      </div>

    </div>
  );
}

