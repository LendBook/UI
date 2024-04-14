// Orderbook.tsx
import React, { useEffect, useRef, useState } from "react";
import { getEthPrice, getIndex, orderbookContract } from "../../contracts";
import { ethers } from "ethers";
import "../../asserts/scss/custom.scss";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
} from "@mui/material";
import { useTake } from "../../hooks/useTake";
import { useBorrow } from "../../hooks/useBorrow";
import { useChangePriceFeed } from "../../hooks/useChangePriceFeed";
import { useOrderContext } from "./OrderContext";
import { activeIndex } from "../Borrow/BorrowModule";

interface OrderbookProps {
  isDeposit: boolean;
}

interface Order {
  id: number;
  limitPrice: string;
  size: string;
  isBorrowable: boolean;
  isBuyOrder: boolean;
}

const Orderbook = ({ isDeposit }: OrderbookProps) => {
  const PAGE_SIZE = 10;

  const [index, setIndex] = useState<string>("0");

  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);

  // VARIABLES
  const [ethPrice, setEthPrice] = useState<string>("0");
  const [size, setSize] = useState<string | null>(null);
  const [limit, setLimit] = useState<string | null>(null);
  const [isBuy, setBuy] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newEthPrice, setNewEthPrice] = useState<string>(ethPrice);

  const [nbOrders, setNbOrders] = useState(10);

  // SELECT ORDER
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { setOrderId, setLimitPrice, setAmount, setIsBuy } = useOrderContext();

  // HOOKS
  const take = useTake();
  const borrow = useBorrow();
  const changePrice = useChangePriceFeed();

  // LOADING
  const [showProgress, setShowProgress] = useState(true);

  const [numVisibleOrders, setNumVisibleOrders] = useState<number>(PAGE_SIZE);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openMenu = Boolean(anchorEl);

  /*const handleStepChange = (event: SelectChangeEvent) => {
        setStep(Number(event.target.value)); // Conversion correcte de string à number
    };*/

  const handleNbOrdersChange = (event: SelectChangeEvent) => {
    setNbOrders(Number(event.target.value));
    setNumVisibleOrders(Number(event.target.value));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchEthPrice = async () => {
    const price = await getEthPrice();
    if (price) setEthPrice(String(price));
  };

  const handleAction = async (orderId: number, size: string) => {
    if (isDeposit) {
      await take(orderId, size);
    } else {
      await borrow(orderId, size);
    }
  };

  const handleRowClick = (
    orderId: number,
    limitPrice: string,
    isBuy: boolean
  ) => {
    setSelectedOrderId(orderId);
    setSize(size);
    setLimit(limitPrice);
    setBuy(isBuy);
    setIsBuy(isBuy);
    setOrderId(orderId);
    setLimitPrice(limitPrice);
    setAmount(size);
  };

  const handleEthPriceChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewEthPrice(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleOkClick = () => {
    setShowProgress(true);
    setEthPrice(newEthPrice);
    setIsEditing(false);
    changePrice(newEthPrice);

    setTimeout(() => {
      setShowProgress(false);
    }, 10000);
  };

  const fetchOrders = async () => {
    try {
      const lastOrderId = await orderbookContract.lastOrderId();
      const numPages = Math.ceil(lastOrderId / PAGE_SIZE);
      const ethPriceInEther = ethPrice;
      const ethPriceNumber = parseFloat(ethPriceInEther) || 0;

      const fetchPromises = Array.from(
        { length: numPages },
        async (_, pageIndex) => {
          const startId = pageIndex * PAGE_SIZE + 1;
          const endId = Math.min(startId + PAGE_SIZE - 1, lastOrderId);

          let fetchedBuyOrders = [];
          let fetchedSellOrders = [];

          for (let i = startId; i <= endId; i++) {
            const order = await orderbookContract.orders(i);
            if (
              parseFloat(ethers.utils.formatUnits(order.quantity, "ether")) > 0
            ) {
              const orderFormatted = {
                id: i,
                limitPrice: ethers.utils.formatUnits(order.price, "ether"),
                size: ethers.utils.formatUnits(order.quantity, "ether"),
                isBorrowable: order.isBorrowable,
                isBuyOrder: order.isBuyOrder,
              };

              const orderPriceNumber = parseFloat(orderFormatted.limitPrice);

              // Mettre à jour la condition pour séparer correctement les ordres d'achat et de vente
              if (
                !orderFormatted.isBuyOrder &&
                orderPriceNumber > ethPriceNumber
              ) {
                fetchedSellOrders.push(orderFormatted); // Ordres d'achat au-dessus du prix d'ETH
              } else if (
                orderFormatted.isBuyOrder &&
                orderPriceNumber < ethPriceNumber
              ) {
                fetchedBuyOrders.push(orderFormatted); // Ordres de vente en dessous du prix d'ETH
              }
            }
          }

          return { fetchedBuyOrders, fetchedSellOrders };
        }
      );

      const results = await Promise.all(fetchPromises);

      // Trier les ordres d'achat par ordre décroissant de prix
      const allBuyOrders = results
        .flatMap((result) => result.fetchedBuyOrders)
        .sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice));
      // Trier les ordres de vente par ordre croissant de prix
      const allSellOrders = results
        .flatMap((result) => result.fetchedSellOrders)
        .sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice));

      setBuyOrders(allBuyOrders);
      setSellOrders(allSellOrders);

      setShowProgress(false);
    } catch (error) {
      console.error("Erreur : ", error);
      setShowProgress(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [buyOrders, sellOrders]);

  useEffect(() => {
    fetchEthPrice();
  }, []);

  useEffect(() => {
    fetchEthPrice();
  }, []);

  useEffect(() => {
    const fetchIndex = async () => {
      const index = await getIndex();
      if (index !== null) {
        setIndex(index.toString());
      }
    };
    fetchIndex();
  }, []);

  return (
    <Card
      sx={{
        maxWidth: "1300px",
        margin: "auto",
        background: "transparent",
        boxShadow: "none",
        border: "none",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          p: "1.5rem 2rem 1.5rem 2rem",
          mb: "2rem",
        }}
      >
        <Box>
          <table className="orderbook-table rounded-lg border-[5px] border-solid border-[#191b1f] ">
            <thead>
              {isDeposit && (
                <tr>
                  <th>Price</th>
                  <th>Liquidity</th>
                  <th>APY</th>
                  <th>Liquidation LTV</th>
                  <th></th>
                </tr>
              )}
              {!isDeposit && activeIndex === 1 && (
                <tr>
                  <th>Price</th>
                  <th>Liquidity</th>
                  <th>APY</th>
                  <th>Liquidation LTV</th>
                  <th></th>
                </tr>
              )}
              {!isDeposit && activeIndex === 0 && (
                <tr>
                  <th>Price</th>
                  <th>Liquidity</th>
                  <th>APY</th>
                  <th>UR</th>
                  <th></th>
                </tr>
              )}
            </thead>
            <tbody>
              {!isDeposit &&
                activeIndex === 1 &&
                sellOrders.slice(0, numVisibleOrders).map((order) => (
                  <tr
                    key={order.id}
                    className={`sell-row ${
                      selectedOrderId === order.id ? "selected-row" : ""
                    }`}
                    onClick={() =>
                      handleRowClick(order.id, order.limitPrice, false)
                    }
                    style={{ height: "20px" }}
                  >
                    <td>{Number(order.limitPrice).toFixed(0)}</td>
                    <td>{Number(order.size).toFixed(0)}</td>
                    <td className="text-white">44%</td>
                    <td className="text-white">{isDeposit ? "7%" : "5.89%"}</td>
                    {!isDeposit && (
                      <td className="text-white">
                        <button
                          className={`button-style ${
                            selectedOrderId === order.id ? "selected-row" : ""
                          }`}
                          onClick={() =>
                            handleRowClick(order.id, order.limitPrice, true)
                          }
                        >
                          SELECT
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

              {isDeposit &&
                sellOrders.slice(0, numVisibleOrders).map((order) => (
                  <tr
                    key={order.id}
                    className={`sell-row ${
                      selectedOrderId === order.id ? "selected-row" : ""
                    }`}
                    onClick={() =>
                      handleRowClick(order.id, order.limitPrice, false)
                    }
                    style={{ height: "20px" }}
                  >
                    <td>{Number(order.limitPrice).toFixed(0)}</td>
                    <td>{Number(order.size).toFixed(0)}</td>
                    <td className="text-white">44%</td>
                    <td className="text-white">{isDeposit ? "7%" : "5.89%"}</td>
                    <td className="text-white">
                      <button
                        className={`button-style ${
                          selectedOrderId === order.id ? "selected-row" : ""
                        }`}
                        onClick={() =>
                          handleRowClick(order.id, order.limitPrice, true)
                        }
                      >
                        SELECT
                      </button>
                    </td>
                  </tr>
                ))}

              {!isDeposit &&
                activeIndex === 0 &&
                sellOrders.slice(0, numVisibleOrders).map((order) => (
                  <tr
                    key={order.id}
                    className={`grey-row ${
                      selectedOrderId === order.id ? "selected-row" : ""
                    }`}
                    onClick={() =>
                      handleRowClick(order.id, order.limitPrice, false)
                    }
                    style={{ height: "20px" }}
                  >
                    <td>{Number(order.limitPrice).toFixed(0)}</td>
                    <td>{Number(order.size).toFixed(0)}</td>
                    <td className="text-white">44%</td>
                    <td className="text-white">{isDeposit ? "7%" : "5.89%"}</td>
                    {!isDeposit && (
                      <td className="text-white">
                        <button
                          className={`button-style buy-row ${
                            selectedOrderId === order.id ? "selected-row" : ""
                          }`}
                        >
                          BORROW
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              <tr className="eth-price-row">
                {!isDeposit && (
                  <td colSpan={4}>
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          value={newEthPrice}
                          onChange={handleEthPriceChange}
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                            border: "none",
                            width: "100px",
                          }}
                        />
                        <button onClick={handleOkClick}>OK</button>
                      </>
                    ) : (
                      <>
                        ${ethPrice}
                        <button
                          onClick={handleEditClick}
                          style={{ marginLeft: "10px" }}
                        >
                          Edit
                        </button>
                        {showProgress && (
                          <CircularProgress
                            size={10}
                            style={{ marginLeft: "10px" }}
                          />
                        )}
                      </>
                    )}
                  </td>
                )}
                {isDeposit && (
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            value={newEthPrice}
                            onChange={handleEthPriceChange}
                            style={{
                              backgroundColor: "transparent",
                              color: "white",
                              border: "none",
                              width: "100px",
                              marginRight: "10px",
                            }}
                          />
                          <button
                            onClick={handleOkClick}
                            style={{ marginRight: "10px" }}
                          >
                            OK
                          </button>
                        </>
                      ) : (
                        <>
                          ${ethPrice}
                          <button
                            onClick={handleEditClick}
                            style={{ marginLeft: "10px", marginRight: "20px" }}
                          >
                            Edit
                          </button>
                          {showProgress && (
                            <CircularProgress
                              size={10}
                              style={{ marginRight: "20px" }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
              <tr>
                {!isDeposit && <th>Price</th>}
                {!isDeposit && <th>Liquidity</th>}
                {/*<th>Size (USDC)</th>*/}
                {!isDeposit && <th>APY</th>}
                {!isDeposit && <th>UR</th>}
                {/* <th>Max LTV</th>*/}
                {activeIndex === 1 && !isDeposit && <th></th>}
              </tr>
              {activeIndex === 0 &&
                buyOrders.slice(0, numVisibleOrders).map((order) => (
                  <tr
                    key={order.id}
                    className={`buy-row ${
                      selectedOrderId === order.id ? "selected-row" : ""
                    }`}
                    // onClick={() => handleRowClick(order.id, order.limitPrice, true)}
                    style={{ height: "20px" }}
                  >
                    <td>{Number(order.limitPrice).toFixed(0)}</td>
                    <td>{Number(order.size).toFixed(0)}</td>
                    <td className="text-white">56%</td>
                    <td className="text-white">{isDeposit ? "7%" : "5.89%"}</td>
                    {isDeposit && (
                      <td className="text-white">
                        {order.isBuyOrder ? (
                          <button
                            className={`button-style ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        ) : (
                          <button
                            className={`button-style buy-row ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        )}
                      </td>
                    )}
                    {!isDeposit && (
                      <td className="text-white">
                        {order.isBuyOrder ? (
                          <button
                            className={`button-style ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        ) : (
                          <button
                            className={`button-style buy-row ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}

              {!isDeposit &&
                activeIndex === 1 &&
                buyOrders.slice(0, numVisibleOrders).map((order) => (
                  <tr
                    key={order.id}
                    className={`grey-row ${
                      selectedOrderId === order.id ? "selected-row" : ""
                    }`}
                    // onClick={() => handleRowClick(order.id, order.limitPrice, true)}
                    style={{ height: "20px" }}
                  >
                    <td>{Number(order.limitPrice).toFixed(0)}</td>
                    <td>{Number(order.size).toFixed(0)}</td>
                    <td className="text-white">56%</td>
                    <td className="text-white">{isDeposit ? "7%" : "5.89%"}</td>
                    {isDeposit && (
                      <td className="text-white">
                        {order.isBuyOrder ? (
                          <button
                            className={`button-style ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        ) : (
                          <button
                            className={`buy-row ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                            onClick={() =>
                              handleRowClick(order.id, order.limitPrice, true)
                            }
                          >
                            SELECT
                          </button>
                        )}
                      </td>
                    )}
                    {!isDeposit && (
                      <td className="text-white">
                        {order.isBuyOrder ? (
                          <button
                            className={`button-style ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                          >
                            SELECT
                          </button>
                        ) : (
                          <button
                            className={`buy-row ${
                              selectedOrderId === order.id ? "selected-row" : ""
                            }`}
                          >
                            BORROW
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Orderbook;
