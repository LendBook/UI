import React, {useEffect, useMemo, useState} from "react";
import {useWeb3Modal} from "@web3modal/react";
import {Box, Card, CardContent, InputAdornment, Switch, TextField} from "@mui/material";
import {useAccount, useWalletClient, type WalletClient,} from "wagmi";
import {ethers, providers} from "ethers";
import {getEthPrice, getUSDCPrice, orderbookContract} from "../../contracts";
import "../../asserts/scss/custom.scss";
import ethIcon from "../../asserts/images/coins/eth.svg";
import usdcIcon from "../../asserts/images/coins/usdc.svg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {useDeposit} from "../../hooks/useDeposit";
import {useEthersSigner} from "../../contracts/index";
import Contrats from "../../contracts/contracts/168587773.json";
import {IconButton} from "@material-tailwind/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useOrderContext} from "../Orderbook/OrderContext";

interface OrderDetails {
    orderId: number;
    limitPrice: string;
    isBuy : boolean | null;
}


export default function DepositModule() {
    const signer = useEthersSigner();
    const {address} = useAccount();
    const {open} = useWeb3Modal();

    const ethImage = ethIcon; // Mettez ici le bon chemin
    const usdcImage = usdcIcon; // Mettez ici le bon chemin


    const [chainId, setChainId] = useState<number | null>(null);

    // BALANCE
    const [ethBalance, setEthBalance] = useState('');
    const [usdcBalance, setUsdcBalance] = useState('0');
    const [wethBalance, setWethBalance] = useState('0');

    // ALLOWANCE
    const [usdcAllowance, setUsdcAllowance] = useState('0');
    const [wethAllowance, setWethAllowance] = useState('0');

    // DEFAUT
    const [activeCurrency, setActiveCurrency] = useState("WETH");
    const [pairedPrice, setpairedPrice] = useState('0');
    const [isSwitchOn, setIsSwitchOn] = useState(true);

    // CHAINLINK FEED PRICE
    const [priceETHUSD, setPriceETHUSD] = useState(0);
    const [priceUSDCUSD, setPriceUSDCUSD] = useState(0);

    // ORDER VARIABLE
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [borrowSize, setBorrowSize] = useState('');

    const [tapStateTabs, setTapStateTabsOrder] = useState(1);
    const [tapStateButton, setTapStateButton] = useState(1);

    const deposit = useDeposit(quantity, buyPrice, pairedPrice, true, true);

    const currencyPrice = activeCurrency === 'WETH' ? priceUSDCUSD : priceETHUSD;

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const {orderId, limitPrice, isBuy} = useOrderContext();

    const calculatedValueEnterAmount = !isNaN(parseFloat(quantity)) && !isNaN(currencyPrice)
        ? `$ ${(parseFloat(quantity) * currencyPrice).toFixed(2)}`
        : 'Enter Amount';

    const calculatedValueLimitPrice = !isNaN(parseFloat(buyPrice)) && !isNaN(currencyPrice)
        ? `$ ${(parseFloat(buyPrice) * currencyPrice).toFixed(2)}`
        : 'Enter Limit Price';

    const orderDetailsText = orderDetails
        ? `${orderDetails.limitPrice}`
        : '';


    const [selectedCurrency, setSelectedCurrency] = useState('WETH');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleCurrencyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleCurrencyClose = () => {
        setAnchorEl(null);
    };

    const handleCurrencyChange = (currency: React.SetStateAction<string>) => {
        setSelectedCurrency(currency);
        handleCurrencyClose();
    };


    const handleUsdcApprove = async () => {
        if (signer) {
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, signer);
            const tx = await usdcContract.approve(orderbookContract.address, ethers.constants.MaxUint256);
            await tx.wait();
            fetchUsdcBalanceAndAllowance();
        }
    };


    // APPROVE
    const handleWethApprove = async () => {
        if (signer) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, signer);
            const tx = await wethContract.approve(orderbookContract.address, ethers.constants.MaxUint256);
            await tx.wait();
            fetchWethBalanceAndAllowance();
        }
    };

    const handleBuyClick = () => {
        setActiveCurrency("USDC");
    };

    const handleSellClick = () => {
        setActiveCurrency("WETH");
    };


    const handleCloseMenu = () => {
        setAnchorEl(null);
    };


    // FETCH BALANCE
    const fetchBalance = async (url: string, decimals: number = 18) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.result) {
                console.log(`No result : ${url}`);
                return null;
            }
            return ethers.utils.formatUnits(data.result, decimals);
        } catch (error) {
            console.error('Error :', error);
            return null;
        }
    };

    const fetchUsdcBalanceAndAllowance = async () => {
        if (signer && address) {
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, signer);
            const balance = await usdcContract.balanceOf(address);
            const userAllowance = await usdcContract.allowance(address, orderbookContract.address);

            setUsdcBalance(Number(ethers.utils.formatUnits(balance, 18)).toFixed(2));
            setUsdcAllowance(Number(ethers.utils.formatUnits(userAllowance, 18)).toFixed(2));
        }
    };
    const fetchWethBalanceAndAllowance = async () => {
        if (signer && address) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, signer);
            const balance = await wethContract.balanceOf(address);
            const userAllowance = await wethContract.allowance(address, orderbookContract.address);

            setWethBalance(Number(ethers.utils.formatUnits(balance, 18)).toFixed(2));
            setWethAllowance(Number(ethers.utils.formatUnits(userAllowance, 18)).toFixed(2));
        }
    };

    useEffect(() => {
        fetchWethBalanceAndAllowance();
    }, [signer, address]);

    useEffect(() => {
        fetchUsdcBalanceAndAllowance();
    }, [signer, address]);

    const toggleOpen = () => {
        open();
    };

    // INPUT
    const onBuyBudgetChange = (e: any) => {
        try {
            if (e.target.value === "") {
                setQuantity('');
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
                setBuyPrice('');
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

    const onPlaceBuyOrder = async () => {
        await deposit(quantity, buyPrice, pairedPrice, true, isSwitchOn);
    };

    const onPlaceSellOrder = async () => {
        await deposit(quantity, buyPrice, pairedPrice, false, isSwitchOn);
    };



    const onRepostOrderChange = (e: any) => {
        try {
            if (e.target.value === "") {
                setpairedPrice('');
            } else {
                let amount = e.target.value;
                amount = amount.toString().replace(/^0+/, "");
                if (amount.length === 0) amount = "0";
                if (amount[0] === ".") amount = "0" + amount;
                setpairedPrice(amount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrderDetails = async (orderId: number, limitPrice: string | null, isBuy: boolean | null): Promise<OrderDetails> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            orderId: orderId,
            limitPrice: limitPrice ?? "0",
            isBuy : isBuy
        };
    };

    const handleMaxClick = () => {
        const maxAmount = selectedCurrency === "USDC" ? usdcBalance : wethBalance;
        setQuantity(maxAmount);
    };

    useEffect(() => {
        if (orderId !== null) {
            fetchOrderDetails(orderId, limitPrice, isBuy).then(details => {
                setOrderDetails(details);
                if (details) {
                    setBuyPrice(details.limitPrice);
                    if (!details.isBuy)
                    {
                        setSelectedCurrency('WETH');
                    }
                    else{
                        setSelectedCurrency('USDC');
                    }
                }
            });
        }
    }, [orderId]);


    const renderLabelDeposit = () => {
        if (selectedCurrency === "USDC") {
            return <>
                {parseFloat(usdcAllowance) < parseFloat(quantity) && (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
                        onClick={handleUsdcApprove}
                    >
                        <span className="text-[#000000] text-[18px] sm:text-[18px]"><b><span className="font-semibold">APPROVE</span></b></span>
                    </div>
                )}
                {parseFloat(usdcAllowance) >= parseFloat(quantity) && (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
                        onClick={async () => {
                            await onPlaceBuyOrder();
                            handleBuyClick();
                        }}
                    >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            DEPOSIT USDC
                        </span>
                    </div>

                )}

                </>;
        } else if (selectedCurrency === "WETH") {
            return <>
                {parseFloat(wethAllowance) < parseFloat(quantity) && (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
                        onClick={handleWethApprove}
                    >
                        <span className="text-[#000000] text-[18px] sm:text-[18px]"><b><span className="font-semibold">APPROVE</span></b></span>
                    </div>
                )}
                {parseFloat(wethAllowance) >= parseFloat(quantity) &&  (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
                        onClick={async () => {
                            await onPlaceSellOrder();
                            handleSellClick();
                        }}
                    >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            DEPOSIT WETH
                        </span>
                    </div>
                )}
            </>;
        }
    };

    useEffect(() => {
        const handleChainChanged = (_chainId: string) => {
            const newChainId = parseInt(_chainId, 16);
            setChainId(newChainId);

            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            if (address) {
                newProvider.getBalance(address).then(balance => {
                    setEthBalance(ethers.utils.formatEther(balance));
                });
            }
        };

        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            provider.getNetwork().then(network => {
                setChainId(network.chainId);
                if (address) {
                    provider.getBalance(address).then(balance => {
                        setEthBalance(ethers.utils.formatEther(balance));
                    });
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [address]);

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


    useEffect(() => {
        if (buyPrice && !isNaN(Number(buyPrice))) {
            const buyPriceNum = parseFloat(buyPrice);
            let adjustPairedPrice = 0;
            if (activeCurrency == 'USDC')
            {
                adjustPairedPrice = buyPriceNum + buyPriceNum * 0.1;
                setpairedPrice(adjustPairedPrice.toString());
            } else if (activeCurrency == 'WETH')
            {
                adjustPairedPrice = buyPriceNum - buyPriceNum * 0.1;
                setpairedPrice(adjustPairedPrice.toString());
            }
            setIsSwitchOn(!isSwitchOn);
        }
    }, [buyPrice]);


    return (
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
                    <div className="buy-box max-w-[500px] w-full flex flex-col gap-[50px] text-white h-[100%] bg-[#131518] border-[5px] border-solid border-[#191b1f]">
                        <div className="flex flex-col gap-[30px] p-[5px] ">
                            <div className="flex flex-col gap-[20px] px-[20px]">
                                <h2 style={{ marginTop: '20px' }}>Trade</h2>
                                <hr />
                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-[20px] mb-[20px]  ">
                                                    <div className="flex flex-col">
                                                        <TextField
                                                            label={"Enter amount"}
                                                            margin="normal"
                                                            value={quantity}
                                                            onChange={onBuyBudgetChange}
                                                            InputLabelProps={{ style: { color: 'white' } }}
                                                            InputProps={{
                                                                style: { color: 'white', backgroundColor: 'transparent' },
                                                                /*endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="select currency"
                                                                            onClick={handleCurrencyClick}
                                                                            style={{ marginRight: '-12px', width: '80px', display: 'flex', alignItems: 'center' }}
                                                                        >
                                                                            {selectedCurrency && (
                                                                                <>
                                                                                    <span style={{ marginLeft: '10px', color: 'white' }}>{selectedCurrency}</span>
                                                                                </>
                                                                            )}
                                                                            {!selectedCurrency && <span style={{ color: 'white' }}>Select Currency</span>}
                                                                            <ArrowDropDownIcon style={{ color: 'white' }} />
                                                                        </IconButton>
                                                                        <Menu
                                                                            id="currency-menu"
                                                                            anchorEl={anchorEl}
                                                                            open={openMenu}
                                                                            onClose={handleCloseMenu}
                                                                            PaperProps={{
                                                                                style: {
                                                                                    backgroundColor: '#191b1f',
                                                                                    color: 'white',
                                                                                    minWidth: '100px',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <MenuItem onClick={() => { setSelectedCurrency('USDC'); handleCloseMenu(); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                                                                                <img src={usdcImage} alt="USDC" style={{ width: '20px', height: '20px' }} />
                                                                                <span style={{ marginLeft: '10px', color: 'white' }}>USDC</span>
                                                                            </MenuItem>
                                                                            <MenuItem onClick={() => { setSelectedCurrency('WETH'); handleCloseMenu(); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                                                                                <img src={ethImage} alt="WETH" style={{ width: '20px', height: '20px' }} />
                                                                                <span style={{ marginLeft: '10px', color: 'white' }}>WETH</span>
                                                                            </MenuItem>
                                                                        </Menu>
                                                                    </InputAdornment>
                                                                ),*/
                                                            }}
                                                            style={{ backgroundColor: '#191b1f' }}
                                                        />

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white text-[12px]">
                                                                Balance: {selectedCurrency === "USDC" ? usdcBalance : wethBalance} {selectedCurrency}
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
                                                            label={"Enter limit price"}
                                                            variant="outlined"
                                                            margin="normal"
                                                            //value={orderDetailsText}
                                                            onChange={onBuyPriceChange}
                                                            InputLabelProps={{ style: { color: 'white' }}}
                                                            InputProps={{ style: { color: 'white' }, readOnly: false }} // Assurez-vous que readOnly est défini sur false
                                                            style={{ backgroundColor: '#191b1f'}}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col ">
                                                        <Accordion  className="blue-accordion">
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>} >
                                                                <Typography className="white-typography">More options</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails >
                                                                <div className="flex flex-col text-white">
                                                                    <TextField
                                                                        label="Enter Paired Limit Price"
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        onChange={onRepostOrderChange}
                                                                        InputLabelProps={{ style: { color: 'white' }}}
                                                                        InputProps={{ style: { color: 'white' }}}
                                                                        style={{ backgroundColor: '#070F15'}}
                                                                    />
                                                                    <div className="text-white text-[12px] px-[10px] mx-[10px] mb-2">
                                                                        { !isNaN(parseFloat(pairedPrice)) && !isNaN(priceUSDCUSD) ? `~ ${(parseFloat(pairedPrice) * priceUSDCUSD).toFixed(2)} $` : null }
                                                                    </div>
                                                                    <div className="flex flex-row justify-between mt-2 mx-[20px] text-white">
                                                                          <span className="text-[15px] opacity-80">
                                                                            <span className="font-semibold">Is borrowable ?</span>
                                                                              <Switch checked={isSwitchOn} onChange={() => setIsSwitchOn(!isSwitchOn)} />
                                                                          </span>
                                                                    </div>
                                                                </div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                                {address && (
                                                    <>
                                                        <div className="flex flex-row justify-center items-center ">
                                                            {quantity === '' && (
                                                                <div
                                                                    className={`w-[70%] py-[10px] text-center rounded-full bg-gray-400`}
                                                                >
                                                                    <span className="text-[#000000] text-[18px] sm:text-[18px]"><b><span className="font-semibold">APPROVE</span></b></span>
                                                                </div>
                                                            )}
                                                            {parseFloat(quantity) !== 0 && (
                                                                renderLabelDeposit()
                                                            )}
                                                        </div>

                                                        <div style={{marginBottom: '20px'}}></div>
                                                    </>
                                                )}
                            </div>
                        </div>
                    </div>
                </Box>
            </CardContent>
        </Card>

    );
}
