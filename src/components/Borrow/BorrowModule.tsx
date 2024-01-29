import React, {useEffect, useMemo, useState} from "react";
import {useWeb3Modal} from "@web3modal/react";
import {InputAdornment, TextField} from "@mui/material";
import {useAccount, useWalletClient, type WalletClient,} from "wagmi";
import {ethers, providers} from "ethers";
import {getEthPrice, getUSDCPrice, orderbookContract} from "../../contracts";
import "../../asserts/scss/custom.scss";
import Contrats from "../../contracts/contracts/168587773.json";
import {useBorrow} from "../../hooks/useBorrow";
import {useOrderContext} from "./Ordercontext";
import {IconButton} from "@material-tailwind/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ethIcon from "../../asserts/images/coins/eth.svg";
import usdcIcon from "../../asserts/images/coins/usdc.svg";

interface OrderDetails {
    id: number;
    liquidationPrice: string;
    LTV: string;
    APY: string;
    maxBorrow: string;
}

export function walletClientToSigner(walletClient: WalletClient) {
    const {account, chain, transport} = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({chainId}: { chainId?: number } = {}) {
    const {data: walletClient} = useWalletClient({chainId});
    return useMemo(
        () => (walletClient ? walletClientToSigner(walletClient) : undefined),
        [walletClient]
    );
}



export default function BorrowModule() {
    const signer = useEthersSigner();
    const {address} = useAccount();
    const {open} = useWeb3Modal();

    const [chainId, setChainId] = useState<number | null>(null);

    const { orderId } = useOrderContext();

    // BALANCE
    const [ethBalance, setEthBalance] = useState('');
    const [usdcBalance, setUsdcBalance] = useState('0');
    const [wethBalance, setWethBalance] = useState('0');

    // ALLOWANCE
    const [usdcAllowance, setUsdcAllowance] = useState('0');
    const [wethAllowance, setWethAllowance] = useState('0');

    // DEFAUT
    const [activeCurrency, setActiveCurrency] = useState("USDC");

    // CHAINLINK FEED PRICE
    const [priceETHUSD, setPriceETHUSD] = useState(0);
    const [priceUSDCUSD, setPriceUSDCUSD] = useState(0);

    // BORROW VARIABLE
    const [quantity, setQuantity] = useState('');
    const [orderID, setOrderID] = useState('');

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    const [tapStateButton, setTapStateButton] = useState(1);

    const [selectedCurrency, setSelectedCurrency] = useState('ETH');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = Boolean(anchorEl);

    const borrow = useBorrow();

    const handleCurrencyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCurrencyClose = () => {
        setAnchorEl(null);
    };

    const fetchOrderDetails = async (orderId: number): Promise<OrderDetails> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            id: orderId,
            liquidationPrice: "1,900",
            LTV: "95",
            APY: "4.2",
            maxBorrow: "40k"
        };
    };


    useEffect(() => {
        if (orderId !== null) {
            fetchOrderDetails(orderId).then(details => {
                setOrderDetails(details);
            });
        }
    }, [orderId]);

    const orderDetailsText = orderDetails
        ? `ID: ${orderDetails.id}\nLiquidation Price: ${orderDetails.liquidationPrice} USDC\nLTV: ${orderDetails.LTV}%\nAPY: ${orderDetails.APY}%\nMax. to borrow: ${orderDetails.maxBorrow} USDC`
        : 'Select an order to see details';


    const currencyPrice = activeCurrency === 'USDC' ? priceUSDCUSD : priceETHUSD;

    const calculatedValueSize = !isNaN(parseFloat(quantity)) && !isNaN(currencyPrice)
        ? `$ ${(parseFloat(quantity) * currencyPrice).toFixed(2)}`
        : 'Enter Amount';


    // APPROVE
    const handleUsdcApprove = async () => {
        if (signer) {
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, signer);
            const tx = await usdcContract.approve(orderbookContract.address, ethers.constants.MaxUint256);
            await tx.wait();
            fetchUsdcBalanceAndAllowance();
        }
    };


    const handleWethApprove = async () => {
        if (signer) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, signer);
            const tx = await wethContract.approve(orderbookContract.address, ethers.constants.MaxUint256);
            await tx.wait();
            fetchWethBalanceAndAllowance();
        }
    };

    const handleBorrowUSDCClick = () => {
        setActiveCurrency("USDC");
    };

    const handleBorrowWETHClick = () => {
        setActiveCurrency("WETH");
    };


    // FETCH BALANCE
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
            console.error('Error :', error);
            return null;
        }
    };

    const fetchUsdcBalanceAndAllowance = async () => {
        if (signer && address) {
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.usdc.abi, signer);
            const balance = await usdcContract.balanceOf(address);
            const userAllowance = await usdcContract.allowance(address, orderbookContract.address);

            setUsdcBalance(ethers.utils.formatUnits(balance, 18));
            setUsdcAllowance(ethers.utils.formatUnits(userAllowance, 18));
        }
    };
    const fetchWethBalanceAndAllowance = async () => {
        if (signer && address) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.weth.abi, signer);
            const balance = await wethContract.balanceOf(address);
            const userAllowance = await wethContract.allowance(address, orderbookContract.address);

            setWethBalance(ethers.utils.formatUnits(balance, 18));
            setWethAllowance(ethers.utils.formatUnits(userAllowance, 18));
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

    const onSizeChange = (e: any) => {
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

    const onOrderChange = (e: any) => {
        try {
            if (e.target.value === "") {
                setOrderID('');
            } else {
                let amount = e.target.value;
                amount = amount.toString().replace(/^0+/, "");
                if (amount.length === 0) amount = "0";
                if (amount[0] === ".") amount = "0" + amount;
                setOrderID(amount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBorrow = async (orderId: string, quantity: string) => {
        try {
            await borrow(Number(orderId), quantity);
        } catch (error) {
            console.error("Error : ", error);
        }
    };


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
                            await handleBorrow(orderID, quantity);
                            handleBorrowUSDCClick();
                        }}
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

                </>;
        } else if (selectedCurrency === "ETH") {
            return <>
                {parseFloat(wethAllowance) < parseFloat(quantity) && (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-red-500`}
                        onClick={handleWethApprove}
                    >
                        <span className="text-[#000000] text-[18px] sm:text-[18px]"><b><span className="font-semibold">APPROVE</span></b></span>
                    </div>
                )}
                {parseFloat(wethAllowance) >= parseFloat(quantity) && (
                    <div
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500`}
                        onClick={async () => {
                            await handleBorrow(orderID, quantity);
                            handleBorrowWETHClick();
                        }}
                    >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            BORROW ETH
                            <img
                                alt="ETH"
                                src={ethIcon}
                                className="w-[20px] h-[20px] ml-1"
                            />
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


    return (
        <div className="pt-[30px] px-0 pb-[60px] hero-container">
            <div className="hero" id="about">
                <div className="hero__wrap">
                    <div className="buy-box max-w-[500px] w-full flex flex-col gap-[50px] text-white h-[100%] bg-[#131518] rounded-lg border-[5px] border-solid border-[#191b1f]">
                        <div className="flex flex-col gap-[30px] p-[5px]  ">
                            <div className="flex flex-col gap-[20px] px-[20px]">
                                            <h2 style={{ marginTop: '20px' }}>Borrow</h2>
                                            <hr />
                                           {/* <div
                                                onClick={() => {
                                                    setTapStateButton(1);
                                                    setActiveCurrency("USDC");
                                                }}
                                                className={`cursor-pointer bg-[#191b1f] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75 ${
                                                    tapStateButton === 1 ? "border-[5px] border-[#FFFFFF] bg-[#000000] " : ""
                                                }`}
                                            >
                                                <span className="flex items-center text-[15px] font-bold text-[white]">
                                                    BORROW ETH
                                                </span>
                                            </div>

                                            <div
                                                onClick={() => {
                                                    setTapStateButton(2);
                                                    setActiveCurrency("WETH")
                                                }}
                                                className={`cursor-pointer bg-[#191b1f] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75 ${
                                                    tapStateButton === 2 ? "border-[5px] border-[#FFFFFF] bg-[#000000] " : ""
                                                }`}
                                            >
                                            <span className="flex items-center text-[15px] font-bold text-[white]">
                                                    BORROW USDC
                                                </span>
                                            </div> */}

                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-[20px] mb-[20px]  ">
                                                    <div className="flex flex-col">
                                                        <TextField
                                                            label="Borrow"
                                                            variant="outlined"
                                                            margin="normal"
                                                            multiline
                                                            rows={5}
                                                            value={orderDetailsText}
                                                            InputLabelProps={{ style: { color: 'white' }}}
                                                            InputProps={{ style: { color: 'white', fontFamily: 'monospace' }}}
                                                            style={{ backgroundColor: '#191b1f'}}
                                                        />

                                                    </div>
                                                    <div className="flex flex-col">
                                                        <TextField
                                                            label={"Collateral"}
                                                            margin="normal"
                                                            onChange={onSizeChange}
                                                            InputLabelProps={{ style: { color: 'white' } }}
                                                            InputProps={{
                                                                style: { color: 'white', backgroundColor: 'transparent' },
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="select currency"
                                                                            onClick={handleCurrencyClick}
                                                                            style={{ marginRight: '-12px', width: '80px', display: 'flex', alignItems: 'center' }}
                                                                        >
                                                                            {selectedCurrency && (
                                                                                <>
                                                                                    {/*<img src={selectedCurrency === 'USDC' ? usdcImage : ethImage} alt={selectedCurrency} style={{ width: '20px', height: '20px' }} /> */}
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
                                                                                <img src={usdcIcon} alt="USDC" style={{ width: '20px', height: '20px' }} />
                                                                                <span style={{ marginLeft: '10px', color: 'white' }}>USDC</span>
                                                                            </MenuItem>
                                                                            <MenuItem onClick={() => { setSelectedCurrency('ETH'); handleCloseMenu(); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                                                                                <img src={ethIcon} alt="ETH" style={{ width: '20px', height: '20px' }} />
                                                                                <span style={{ marginLeft: '10px', color: 'white' }}>ETH</span>
                                                                            </MenuItem>
                                                                        </Menu>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            style={{ backgroundColor: '#191b1f' }}
                                                        />


                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white text-[12px]">
                                                                Balance: {selectedCurrency === "USDC" ? usdcBalance : ethBalance} {selectedCurrency}
                                                            </span>
                                                            <button
                                                                className="text-[12px] text-white underline"
                                                                onClick={selectedCurrency === "USDC" ? () => setQuantity(usdcBalance) : () => setQuantity(ethBalance)}
                                                            >
                                                                Max
                                                            </button>
                                                        </div>
                                                </div>

                                                {address && (
                                                    <>
                                                        <div className="flex flex-row justify-center items-center ">
                                                            {renderLabelDeposit()}
                                                        </div>
                                                    </>
                                                )}
                                                </div>
                                    </div>
                            {!address && (
                                <div className="flex flex-row justify-center items-center">
                                    <div
                                        onClick={() => {
                                            toggleOpen();
                                        }}
                                        className="w-[70%] py-[10px] bg-bgBtn text-center rounded-full cursor-pointer hover:opacity-75 select-none"
                                    >
                                          <span id="connect-wallet" className="text-white text-[15px]">
                                            Connect Wallet
                                          </span>
                                    </div>
                                </div>
                            )}
                            <div className="text-[15px] text-center pb-[15px]">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
