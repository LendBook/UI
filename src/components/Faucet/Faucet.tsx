import React, {useEffect, useMemo, useState} from "react";
import {useWeb3Modal} from "@web3modal/react";
import {InputAdornment, Switch, TextField} from "@mui/material";
import {useAccount, useWalletClient, type WalletClient,} from "wagmi";
import {ethers, providers} from "ethers";
import "../../asserts/scss/custom.scss";
import ethIcon from "../../asserts/images/coins/eth.svg";
import usdcIcon from "../../asserts/images/coins/usdc.svg";
import Contrats from "../../contracts/contracts/97.json";
import {IconButton} from "@material-tailwind/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useMint } from "../../hooks/useMint";
import { usdcContractWrapper, wethContractWrapper } from "../../contracts/index";

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


export default function Faucet() {
  const signer = useEthersSigner();
  const {address} = useAccount();
  const {open} = useWeb3Modal();

  const ethImage = ethIcon;
  const usdcImage = usdcIcon;

  const [chainId, setChainId] = useState<number | null>(null);

  // BALANCE
  const [ethBalance, setEthBalance] = useState('');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [wethBalance, setWethBalance] = useState('0');

  const [activeCurrency, setActiveCurrency] = useState("USDC");

  const [quantity, setQuantity] = useState('');

  const [isValidQty, setIsValidQty] = useState(true);


  const [selectedCurrency, setSelectedCurrency] = useState('WETH');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [error, setError] = useState('');
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

  const handleUSDCClick = () => {
    setActiveCurrency("USDC");
  };

  const handleWETHClick = () => {
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

  const toggleOpen = () => {
    open();
  };

  // INPUT
  const onQtyChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setQuantity('');
        setIsValidQty(true);
      } else {
        let amount = e.target.value;
        const value = e.target.value;
        if (value > 5000) {
          setError("You can't mint more than 5000 amount");
          setIsValidQty(false);
        } else {
          setError('');
          setIsValidQty(true);
        }
        setQuantity(value);
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setQuantity(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const useMintUsdc = () => {
    return useMint(usdcContractWrapper);
  };

  const useMintWeth = () => {
    return useMint(wethContractWrapper);
  };

  const mintUsdc = useMintUsdc();
  const mintWeth = useMintWeth();

  const onMintUsdc = async () => {
    await mintUsdc(String(address), quantity);
    console.log("lol")
  };

  const onMintWeth = async () => {
    await mintWeth(String(address), quantity);
  };


  const renderLabelDeposit = () => {
    if (selectedCurrency === "USDC") {
      return <>
            <div
                className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500 ${!isValidQty ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={async () => {
                  if (isValidQty) {
                    await onMintUsdc();
                    handleUSDCClick();
                  }
                }}
            >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            MINT USDC
                          {/*<img
                                alt="ETH"
                                src={ethIcon}
                                className="w-[20px] h-[20px] ml-1"
                            /> */}
                        </span>
            </div>
      </>;
    } else if (selectedCurrency === "WETH") {
      return <>
            <div
                className={`w-[70%] py-[10px] text-center rounded-full cursor-pointer hover:opacity-75 select-none bg-green-500 ${!isValidQty ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={async () => {
                  if (isValidQty) {
                    await onMintWeth();
                    handleWETHClick();
                  }
                }}
            >
                        <span className="flex items-center justify-center text-[#000000] text-[18px] sm:text-[18px] font-semibold">
                            MINT WETH
                          {/* <img
                                alt="ETH"
                                src={ethIcon}
                                className="w-[20px] h-[20px] ml-1"
                            /> */}
                        </span>
            </div>

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


  return (
      <div className="pt-[30px] px-0 pb-[60px] hero-container">
        <div className="hero">
          <div className="hero__wrap ">
            <div className="buy-box max-w-[500px] w-full flex flex-col gap-[50px] text-white h-[100%] bg-[#131518] rounded-lg border-[5px] border-solid border-[#191b1f]">
              <div className="flex flex-col gap-[30px] p-[5px] ">
                <div className="flex flex-col gap-[20px] px-[20px]">
                  <h2 style={{ marginTop: '20px' }}>Faucet</h2>
                  <hr />
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-[20px] mb-[20px]  ">
                          <div className="flex flex-col">
                            <TextField
                                label={"Enter amount"}
                                margin="normal"
                                onChange={onQtyChange}
                                error={error ? true : false}
                                helperText={error}
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
                                            <img src={usdcImage} alt="USDC" style={{ width: '20px', height: '20px' }} />
                                            <span style={{ marginLeft: '10px', color: 'white' }}>USDC</span>
                                          </MenuItem>
                                          <MenuItem onClick={() => { setSelectedCurrency('WETH'); handleCloseMenu(); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                                            <img src={ethImage} alt="ETH" style={{ width: '20px', height: '20px' }} />
                                            <span style={{ marginLeft: '10px', color: 'white' }}>WETH</span>
                                          </MenuItem>
                                        </Menu>
                                      </InputAdornment>
                                  ),
                                }}
                                style={{ backgroundColor: '#191b1f' }}
                            />

                            <div className="flex justify-between items-center">
                                                            <span className="text-white text-[12px]">
                                                                Balance: {selectedCurrency === "USDC" ? usdcBalance : wethBalance} {selectedCurrency}
                                                            </span>
                            </div>
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
