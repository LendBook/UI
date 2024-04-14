import React, { useEffect, useMemo, useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAccount, useWalletClient, type WalletClient } from "wagmi";
import { ethers, providers } from "ethers";
import {
  getEthPrice,
  getUSDCPrice,
  orderbookContract,
  useEthersSigner,
} from "../../contracts";
import "../../asserts/scss/custom.scss";
import Contrats from "../../contracts/contracts/168587773.json";
import { useBorrow } from "../../hooks/useBorrow";
import { useOrderContext } from "../Orderbook/OrderContext";
import { IconButton, Tab, Tabs } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuItem from "@mui/material/MenuItem";
import ethIcon from "../../asserts/images/coins/eth.svg";
import usdcIcon from "../../asserts/images/coins/usdc.svg";

interface OrderDetails {
  id: number;
  liquidationPrice: string;
  limitPrice: string;
  amount: string;
  LTV: string;
  APY: string;
  maxBorrow: string;
  isBuy: boolean | null;
}

export let activeIndex: number = 1;

export default function BorrowModule() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const [activeTab, setActiveTab] = useState(0);

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handleAdvancedModeChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsAdvancedMode(event.target.checked);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
    activeIndex = activeTab;
  };
  const [chainId, setChainId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USDC");
  const [activeCurrency, setActiveCurrency] = useState("USDC");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [pairedPriceDefault, setpairedPriceDefault] = useState("0");

  const { orderId, limitPrice, amount, isBuy } = useOrderContext();
  const openMenu = Boolean(anchorEl);

  // BALANCE
  const [ethBalance, setEthBalance] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [wethBalance, setWethBalance] = useState("0");

  // ALLOWANCE
  const [usdcAllowance, setUsdcAllowance] = useState("0");
  const [wethAllowance, setWethAllowance] = useState("0");

  // CHAINLINK FEED PRICE
  const [priceETHUSD, setPriceETHUSD] = useState(0);
  const [priceUSDCUSD, setPriceUSDCUSD] = useState(0);

  // BORROW VARIABLE
  const [quantity, setQuantity] = useState("");
  const [orderID, setOrderID] = useState("");
  const [orderIdForBorrow, setOrderIdForBorrow] = useState<number | null>(null);

  const borrow = useBorrow();

  const currencyPrice = activeCurrency === "USDC" ? priceUSDCUSD : priceETHUSD;

  const [buyPrice, setBuyPrice] = useState("");
  const [pairedPrice, setpairedPrice] = useState("0");

  const orderDetailsText = orderDetails
    ? `Price: ${Number(orderDetails.limitPrice).toFixed(
        0
      )} USDC\nPaired limit price: ${Number(pairedPriceDefault).toFixed(0)}\n`
    : `Select an order to see details`;

  const orderDetailsTextDeposit = orderDetails
    ? `${orderDetails.limitPrice}`
    : "";

  const calculatedValueSize =
    !isNaN(parseFloat(quantity)) && !isNaN(currencyPrice)
      ? `$ ${(parseFloat(quantity) * currencyPrice).toFixed(2)}`
      : "Enter Amount";

  const handleCurrencyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUsdcApprove = async () => {
    if (signer) {
      const usdcContract = new ethers.Contract(
        Contrats.usdc.address,
        Contrats.usdc.abi,
        signer
      );
      const tx = await usdcContract.approve(
        orderbookContract.address,
        ethers.constants.MaxUint256
      );
      await tx.wait();
      fetchUsdcBalanceAndAllowance();
    }
  };

  const handleWethApprove = async () => {
    if (signer) {
      const wethContract = new ethers.Contract(
        Contrats.weth.address,
        Contrats.weth.abi,
        signer
      );
      const tx = await wethContract.approve(
        orderbookContract.address,
        ethers.constants.MaxUint256
      );
      await tx.wait();
      fetchWethBalanceAndAllowance();
    }
  };

  const handleCurrencyClose = () => {
    setAnchorEl(null);
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  const handleMenuItemClick = (price: string | null) => {
    if (price !== null) {
      setpairedPrice(price);
      handleCurrencyClose();
    }
    setSelectedMenuItem((prevPrice) => {
      if (prevPrice === price) {
        return null;
      } else {
        return price;
      }
    });
  };

  const handleBorrowUSDCClick = () => {
    setActiveCurrency("USDC");
  };

  const handleBorrowWETHClick = () => {
    setActiveCurrency("WETH");
  };

  const fetchOrderDetails = async (
    orderId: number,
    limitPrice: string | null,
    amount: string | null,
    isBuy: boolean | null
  ): Promise<OrderDetails> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setpairedPriceDefault(String(parseFloat(limitPrice ?? "0") * 1.1));
    return {
      id: orderId,
      limitPrice: limitPrice ?? "0",
      amount: amount ?? "0",
      liquidationPrice: "1,900",
      LTV: "95",
      APY: "4.2",
      maxBorrow: "40k",
      isBuy: isBuy ?? true,
    };
  };

  const fetchBalance = async (url: string, decimals: number = 18) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.result) {
        console.log(`No result: ${url}`);
        return null;
      }
      return ethers.utils.formatUnits(data.result, decimals);
    } catch (error) {
      console.error("Error :", error);
      return null;
    }
  };

  const fetchUsdcBalanceAndAllowance = async () => {
    if (signer && address) {
      const usdcContract = new ethers.Contract(
        Contrats.usdc.address,
        Contrats.usdc.abi,
        signer
      );
      const balance = await usdcContract.balanceOf(address);
      const userAllowance = await usdcContract.allowance(
        address,
        orderbookContract.address
      );

      setUsdcBalance(ethers.utils.formatUnits(balance, 18));
      setUsdcAllowance(ethers.utils.formatUnits(userAllowance, 18));
    }
  };
  const fetchWethBalanceAndAllowance = async () => {
    if (signer && address) {
      const wethContract = new ethers.Contract(
        Contrats.weth.address,
        Contrats.weth.abi,
        signer
      );
      const balance = await wethContract.balanceOf(address);
      const userAllowance = await wethContract.allowance(
        address,
        orderbookContract.address
      );

      setWethBalance(ethers.utils.formatUnits(balance, 18));
      setWethAllowance(ethers.utils.formatUnits(userAllowance, 18));
    }
  };

  const toggleOpen = () => {
    open();
  };

  const onSizeChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setQuantity("");
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setQuantity(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBuyPriceChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setBuyPrice("");
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setBuyPrice(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBuyBudgetChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setQuantity("");
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setQuantity(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBorrow = async (quantity: string) => {
    try {
      if (orderIdForBorrow !== null) {
        await borrow(orderIdForBorrow, quantity);
      } else {
        console.error("Order ID for borrowing is null");
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = wethBalance;
    setQuantity(maxAmount);
  };

  useEffect(() => {}, [quantity]);

  useEffect(() => {
    if (orderId !== null) {
      setOrderIdForBorrow(orderId);
    }
  }, [orderId]);

  const renderLabelDeposit = () => {
    if (selectedCurrency === "USDC") {
      return (
        <>
          {parseFloat(usdcAllowance) < parseFloat(quantity) && (
            <div
              className={`w-[70%] py-2 text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
              onClick={handleUsdcApprove}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <span className="text-[#000000] text-[18px] sm:text-[18px]">
                <b>
                  <span className="font-semibold">APPROVE</span>
                </b>
              </span>
            </div>
          )}
          {parseFloat(usdcAllowance) >= parseFloat(quantity) && (
            <div
              className={`w-[70%] py-2 text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
              onClick={async () => {
                await handleBorrow(quantity);
                handleBorrowUSDCClick();
              }}
              style={{ marginTop: "15px", marginBottom: "15px" }}
            >
              <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                BORROW USDC
                <img
                  alt="USDC"
                  src={usdcIcon}
                  className="w-[20px] h-[20px] ml-1"
                />
              </span>
            </div>
          )}
        </>
      );
    } else if (selectedCurrency === "WETH") {
      return (
        <>
          {parseFloat(wethAllowance) < parseFloat(quantity) && (
            <div
              className={`w-[70%] py-2 text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-red-500`}
              onClick={handleWethApprove}
              style={{ marginTop: "15px", marginBottom: "15px" }}
            >
              <span className="text-[#000000] text-[18px] sm:text-[18px]">
                <b>
                  <span className="font-semibold">APPROVE</span>
                </b>
              </span>
            </div>
          )}
          {parseFloat(wethAllowance) >= parseFloat(quantity) && (
            <div
              className={`w-[70%] py-2  text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
              onClick={async () => {
                await handleBorrow(quantity);
                handleBorrowWETHClick();
              }}
              style={{ marginTop: "15px", marginBottom: "15px" }}
            >
              <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                BORROW WETH
                <img
                  alt="ETH"
                  src={ethIcon}
                  className="w-[20px] h-[20px] ml-1"
                />
              </span>
            </div>
          )}
        </>
      );
    }
  };

  useEffect(() => {
    if (orderId !== null) {
      fetchOrderDetails(orderId, limitPrice, amount, isBuy).then((details) => {
        setOrderDetails(details);
      });
    }
  }, [orderId]);

  useEffect(() => {
    fetchWethBalanceAndAllowance();
  }, [signer, address]);

  useEffect(() => {
    fetchUsdcBalanceAndAllowance();
  }, [signer, address]);

  useEffect(() => {
    const handleChainChanged = (_chainId: string) => {
      const newChainId = parseInt(_chainId, 16);
      setChainId(newChainId);

      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      if (address) {
        newProvider.getBalance(address).then((balance) => {
          setEthBalance(ethers.utils.formatEther(balance));
        });
      }
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.getNetwork().then((network) => {
        setChainId(network.chainId);
        if (address) {
          provider.getBalance(address).then((balance) => {
            setEthBalance(ethers.utils.formatEther(balance));
          });
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address]);

  useEffect(() => {
    if (orderId !== null) {
      fetchOrderDetails(orderId, limitPrice, amount, isBuy).then((details) => {
        setOrderDetails(details);
        if (details) {
          if (!details.isBuy) {
            setSelectedCurrency("WETH");
          }
          /* else{
                        setSelectedCurrency('USDC');
                    }*/
        }
      });
    }
  }, [orderId]);

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
          <div className="flex flex-col text-white bg-[#131518] border-[5px] border-solid border-[#191b1f] px-[20px]">
            <Box>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab
                  label="Deposit collateral (1)"
                  sx={{ color: "grey", "&.Mui-selected": { color: "white" } }}
                />
                <Tab
                  label="Borrow (2)"
                  sx={{ color: "grey", "&.Mui-selected": { color: "white" } }}
                />
              </Tabs>
              <TabPanel value={activeTab} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-[20px] mb-[20px]  ">
                  <div className="flex flex-col">
                    <TextField
                      label={"Enter amount"}
                      margin="normal"
                      value={quantity}
                      onChange={onBuyBudgetChange}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        style: {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                      }}
                      style={{ backgroundColor: "#191b1f" }}
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-white text-[12px]">
                        Balance:{" "}
                        {selectedCurrency === "USDC"
                          ? usdcBalance
                          : wethBalance}{" "}
                        {selectedCurrency}
                      </span>
                      <button
                        className="text-[12px] text-white underline"
                        onClick={handleMaxClick}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <TextField
                      //label="Borrow"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={5}
                      value={orderDetailsText}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        style: {
                          color: "white",
                          fontFamily: "monospace",
                        },
                      }}
                      style={{ backgroundColor: "#191b1f" }}
                    />
                  </div>

                  <div className="flex flex-col ">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isAdvancedMode}
                          onChange={handleAdvancedModeChange}
                        />
                      }
                      label="Advance Mode"
                    />
                    {isAdvancedMode && (
                      <div className="flex flex-col">
                        <Accordion className="blue-accordion">
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                          >
                            <Typography className="white-typography">
                              Paired limit price
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="flex flex-col text-white">
                              <MenuItem
                                onClick={() =>
                                  handleMenuItemClick(
                                    String(parseFloat(limitPrice ?? "0") * 1.1)
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.1)
                                      ? "#f3f4f6"
                                      : "transparent",
                                  color:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.1)
                                      ? "#000000"
                                      : "#ffffff",
                                }}
                              >
                                {String(parseFloat(limitPrice ?? "0") * 1.1)}
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleMenuItemClick(
                                    String(parseFloat(limitPrice ?? "0") * 1.2)
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.2)
                                      ? "#f3f4f6"
                                      : "transparent",
                                  color:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.2)
                                      ? "#000000"
                                      : "#ffffff",
                                }}
                              >
                                {String(parseFloat(limitPrice ?? "0") * 1.2)}
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleMenuItemClick(
                                    String(parseFloat(limitPrice ?? "0") * 1.3)
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.3)
                                      ? "#f3f4f6"
                                      : "transparent",
                                  color:
                                    selectedMenuItem ===
                                    String(parseFloat(limitPrice ?? "0") * 1.3)
                                      ? "#000000"
                                      : "#ffffff",
                                }}
                              >
                                {String(parseFloat(limitPrice ?? "0") * 1.3)}
                              </MenuItem>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    )}
                  </div>
                  {address && (
                    <>
                      <div className="flex flex-row justify-center items-center ">
                        {quantity === "" && (
                          <div
                            className={`w-[70%] py-[10px] text-center rounded-full bg-gray-400`}
                          >
                            <span className="text-[#000000] text-[18px] sm:text-[18px]">
                              <b>
                                <span className="font-semibold">APPROVE</span>
                              </b>
                            </span>
                          </div>
                        )}
                        {parseFloat(quantity) !== 0 && renderLabelDeposit()}
                      </div>
                    </>
                  )}
                </div>
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <div className="grid grid-cols-1 md:grid-cols-1  mb-[20px">
                  <div className="flex flex-col">
                    <TextField
                      //label="Borrow"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={5}
                      value={orderDetailsText}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        style: { color: "white", fontFamily: "monospace" },
                      }}
                      style={{ backgroundColor: "#191b1f" }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <TextField
                      label={"Amount"}
                      margin="normal"
                      onChange={onSizeChange}
                      value={quantity}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        style: {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                      }}
                      style={{ backgroundColor: "#191b1f" }}
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-white text-[12px]">
                        Balance:{" "}
                        {selectedCurrency === "USDC"
                          ? usdcBalance
                          : wethBalance}{" "}
                        {selectedCurrency}
                      </span>
                      <button
                        className="text-[12px] text-white underline"
                        onClick={handleMaxClick}
                      >
                        Max
                      </button>
                    </div>

                    <div style={{ marginBottom: "20px" }}></div>
                  </div>
                  <div className="flex flex-row justify-center items-center ">
                    {quantity === "" && (
                      <div
                        className={`w-[70%] py-[10px] text-center rounded-full bg-gray-400`}
                      >
                        <span className="text-[#000000] text-[18px] sm:text-[18px]">
                          <b>
                            <span className="font-semibold">APPROVE</span>
                          </b>
                        </span>
                      </div>
                    )}
                    {parseFloat(quantity) !== 0 && renderLabelDeposit()}
                  </div>
                  <div style={{ marginBottom: "20px" }}></div>
                </div>
              </TabPanel>
            </Box>
          </div>
        </Box>
      </CardContent>
    </Card>
  );

  function TabPanel({
    children,
    value,
    index,
  }: {
    children: React.ReactNode;
    value: number;
    index: number;
  }) {
    return (
      <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }
}
