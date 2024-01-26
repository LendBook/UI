import React, {useEffect, useMemo, useState} from "react";
import {useWeb3Modal} from "@web3modal/react";
import {InputAdornment, Switch, TextField} from "@mui/material";
import {useAccount, useWalletClient, type WalletClient,} from "wagmi";
import {ethers, providers} from "ethers";
import {getEthPrice, getUSDCPrice, orderbookContract} from "../contracts";
import "../asserts/scss/custom.scss";
import ethIcon from "../asserts/images/coins/eth.svg";
import usdcIcon from "../asserts/images/coins/usdc.svg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {useDeposit} from "../hooks/useDeposit";
import Contrats from "../contracts/contracts/97.json";
import {IconButton} from "@material-tailwind/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



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


export default function Trade() {
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
    const [activeCurrency, setActiveCurrency] = useState("USDC");
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

    const currencyPrice = activeCurrency === 'USDC' ? priceUSDCUSD : priceETHUSD;

    const calculatedValueEnterAmount = !isNaN(parseFloat(quantity)) && !isNaN(currencyPrice)
        ? `$ ${(parseFloat(quantity) * currencyPrice).toFixed(2)}`
        : 'Enter Amount';

    const calculatedValueLimitPrice = !isNaN(parseFloat(buyPrice)) && !isNaN(currencyPrice)
        ? `$ ${(parseFloat(buyPrice) * currencyPrice).toFixed(2)}`
        : 'Enter Limit Price';

    const [selectedCurrency, setSelectedCurrency] = useState('ETH');
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
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.token.abi, signer);
            const tx = await usdcContract.approve(orderbookContract.address, ethers.constants.MaxUint256);
            await tx.wait();
            fetchUsdcBalanceAndAllowance();
        }
    };


    // APPROVE
    const handleWethApprove = async () => {
        if (signer) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.token.abi, signer);
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
            const usdcContract = new ethers.Contract(Contrats.usdc.address, Contrats.token.abi, signer);
            const balance = await usdcContract.balanceOf(address);
            const userAllowance = await usdcContract.allowance(address, orderbookContract.address);

            setUsdcBalance(ethers.utils.formatUnits(balance, 18));
            setUsdcAllowance(ethers.utils.formatUnits(userAllowance, 18));
        }
    };
    const fetchWethBalanceAndAllowance = async () => {
        if (signer && address) {
            const wethContract = new ethers.Contract(Contrats.weth.address, Contrats.token.abi, signer);
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


    const renderLabelDeposit = () => {
        if (tapStateButton === 1) {
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
                            BUY ETH
                            <img
                                alt="ETH"
                                src={ethIcon}
                                className="w-[20px] h-[20px] ml-1"
                            />
                        </span>
                    </div>

                )}

                </>;
        } else if (tapStateButton === 2) {
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
                        className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-red-500`}
                        onClick={async () => {
                            await onPlaceSellOrder();
                            handleSellClick();
                        }}
                    >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            SELL ETH
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
        <div className="pt-[30px] px-0 pb-[60px] hero-container">
            <div className="hero" id="about">
                <div className="hero__wrap">
                    <div className="buy-box max-w-[500px] w-full flex flex-col gap-[50px] text-white h-[100%] bg-[black]">
                        <div className="flex flex-col gap-[30px] p-[5px]  rounded-lg border-[2px] border-solid boder-[#d4dadf]">
                            <div className="flex flex-col gap-[20px] px-[20px]">
                                <h2>Deposit</h2>
                                <hr />
                                        {tapStateTabs < 3 && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-[20px] mb-[20px]  ">
                                                    <div className="flex flex-col">
                                                        <TextField
                                                            label={calculatedValueEnterAmount}
                                                            variant="outlined"
                                                            margin="normal"
                                                            type="number"
                                                            onChange={onBuyBudgetChange}
                                                            InputLabelProps={{ style: { color: 'white' }}}
                                                            InputProps={{
                                                                style: { color: 'white', backgroundColor: 'transparent' },
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="select currency"
                                                                            onClick={handleCurrencyClick}
                                                                            style={{ marginRight: '-12px' }}
                                                                        >
                                                                            <img src={selectedCurrency === 'USDC' ? usdcImage : ethImage} alt={selectedCurrency} style={{ width: '20px', height: '20px' }} />
                                                                            <span style={{ color: 'white', marginLeft: '5px', marginRight: '5px' }}>{selectedCurrency}</span>
                                                                            <ArrowDropDownIcon style={{ color: 'white' }} />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            style={{ backgroundColor: '#131518' }}
                                                        />
                                                        <Menu
                                                            id="currency-menu"
                                                            anchorEl={anchorEl}
                                                            open={openMenu}
                                                            onClose={() => setAnchorEl(null)}
                                                            PaperProps={{
                                                                style: {
                                                                    backgroundColor: 'transparent',
                                                                    color: 'white',
                                                                    minWidth: '50px', // Augmentez la largeur ici
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem onClick={() => setSelectedCurrency('USDC')}>
                                                                <img src={usdcImage} alt="USDC" style={{ width: '20px', height: '20px' }} />
                                                                <span style={{ marginLeft: '10px' }}>USDC</span>
                                                            </MenuItem>
                                                            <MenuItem onClick={() => setSelectedCurrency('ETH')}>
                                                                <img src={ethImage} alt="ETH" style={{ width: '20px', height: '20px' }} />
                                                                <span style={{ marginLeft: '10px' }}>ETH</span>
                                                            </MenuItem>
                                                        </Menu>

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


                                                    <div className="flex flex-col">
                                                        <TextField
                                                            label={calculatedValueLimitPrice}
                                                            variant="outlined"
                                                            margin="normal"
                                                            type="number"
                                                            onChange={onBuyPriceChange}
                                                            InputLabelProps={{ style: { color: 'white' }}}
                                                            InputProps={{ style: { color: 'white' }}}
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
                                                                        type="number"
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
                                                                        {/* <div className="info-icon">
                                                                            <span className="info-tooltip">ON if the order is borrowable</span>
                                                                            ⓘ
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                                {address && (
                                                    <>
                                                        <div className="flex flex-row justify-center items-center ">
                                                            {renderLabelDeposit()}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
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
                <div id="JMW-claimable-button"></div>
            </div>
        </div>
    );
}
