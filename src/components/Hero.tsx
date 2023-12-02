import {useEffect, useMemo, useState} from "react";
import {getSubString, toBigNum} from "../utils";
import {useWeb3Modal} from "@web3modal/react";
import {NotificationManager} from "react-notifications";
import {ProgressBar} from "react-rainbow-components";
import {Divider} from "@mui/material";
import Countdown, {CountdownRenderProps} from 'react-countdown';
import {useAccount, useWalletClient, type WalletClient,} from "wagmi";
import {ethers, providers} from "ethers";
import {presaleContract, usdtContract} from "../contracts";
import "../asserts/scss/custom.scss";
import ethIcon from "../asserts/images/coins/eth.svg";
import usdtIcon from "../asserts/images/coins/usdt.svg";
import bnbIcon from "../asserts/images/coins/bnb.svg";
import claimIcon from "../asserts/images/coins/claim.png";
import stakeIcon from "../asserts/images/coins/stake.svg";
import slideLogo from "../asserts/images/preview/logo.svg";
import TagManager from "react-gtm-module";


const tagManagerArgs = {
  gtmId: 'GTM-TVWJ4GKQ'
}

TagManager.initialize(tagManagerArgs)

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
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
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}



export default function Hero() {
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const [chainId, setChainId] = useState<number | null>(null);
  const [ethBalance, setEthBalance] = useState('');
  const [usdtBalance, setUsdtBalance] = useState('');

  const [balanceETH, setBalanceETH] = useState<number | null>(null);
  const [balanceBNB, setBalanceBNB] = useState<number | null>(null);
  const [balanceUSDT_ETH, setBalanceUSDT_ETH] = useState<number | null>(null);
  const [balanceUSDT_BNB, setBalanceUSDT_BNB] = useState<number | null>(null);

  const [deadline, setDeadline] = useState(new Date("2024-01-15T00:00:00"));
  const [tokenPrice, setTokePrice] = useState(0);
  const [tokenUsdtPrice, setTokeUsdtPrice] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenUsdtAmount, setTokenUsdtAmount] = useState(0);
  const [claimTokenAmount, setClaimTokenAmount] = useState(0);
  const [isClaim, setClaim] = useState(false);
  const [tapState, setTapState] = useState(1);
  const [progressStatus, setProgressStatus] = useState(0);
  const [totalSaled, setTotalSaled] = useState(0);
  const [isFinished, setIsFinished] = useState(false);


  const toggleOpen = () => {
    open();
  };

  const countdownComplete = () => {
    setIsFinished(false);
  };

  useEffect(() => {
    const getPrice = async () => {
      let tokenPrice = Number(await presaleContract.ethBuyHelper(1e10)) / 1e10;
      setTokePrice(tokenPrice);

      let tokenUsdtPrice =
        Number(await presaleContract.usdtBuyHelper(1e10)) / 1e10;
      setTokeUsdtPrice(tokenUsdtPrice);

      console.log("token price", tokenPrice);
      console.log("token usdt price", tokenUsdtPrice);
    };
    getPrice();
  }, []);

  const fetchBalance = async (url: string, decimals: number = 18) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.result) {
        console.log(`Pas de résultat pour l'URL: ${url}`);
        return null;
      }
      return ethers.utils.formatUnits(data.result, decimals);
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      return null;
    }
  };

  useEffect(() => {
    setBalanceETH(null);
    setBalanceBNB(null);
    setBalanceUSDT_ETH(null);
    setBalanceUSDT_BNB(null);

    if (address) {
      const apiKeyETH = "H2VYXD5EX8DFPK34DY8TW2JDA1FHEAVQT7";
      const apiKeyBSC = "HKDUN68PC45B9SK7XI1CW8VNQCG127HMY9";
      let urlETH, urlUSDT, tokenAddressUSDT;

        if (chainId === 1) { // Ethereum
          urlETH = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKeyETH}`;
          tokenAddressUSDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
          urlUSDT = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddressUSDT}&address=${address}&tag=latest&apikey=${apiKeyETH}`;

          fetchBalance(urlETH, 18).then(balanceInEther => {
              setBalanceETH(balanceInEther ? parseFloat(balanceInEther) : null);
          });
          fetchBalance(urlUSDT, 6).then(balanceInUSDT => { // USDT a 6 décimales sur Ethereum
              setBalanceUSDT_ETH(balanceInUSDT ? parseFloat(balanceInUSDT) : null);
          });
        } else if (chainId === 56) { // Binance Smart Chain
          urlETH = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKeyBSC}`;
          tokenAddressUSDT = "0x55d398326f99059fF775485246999027B3197955";
          urlUSDT = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenAddressUSDT}&address=${address}&tag=latest&apikey=${apiKeyBSC}`;

          fetchBalance(urlETH, 18).then(balanceInBNB => {
              setBalanceBNB(balanceInBNB ? parseFloat(balanceInBNB) : null);
          });
          fetchBalance(urlUSDT, 18).then(balanceInUSDT_BNB => { // USDT a 18 décimales sur BSC
            setBalanceUSDT_BNB(balanceInUSDT_BNB ? parseFloat(balanceInUSDT_BNB) : null);
          });
        } else {
          // Gérer les autres chaînes ou les erreurs ici
        }
      };

  }, [address, chainId]);

  useEffect(() => {
    if (balanceETH || balanceBNB || balanceUSDT_ETH || balanceUSDT_BNB) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'walletInfo',
          walletAddress: address,
          walletBalanceETH: balanceETH,
          walletBalanceBNB: balanceBNB,
          walletBalanceUSDT: balanceUSDT_ETH,
          walletBalanceUSDT_BNB: balanceUSDT_BNB,
        },
      });
    }
  }, [balanceETH, balanceBNB, balanceUSDT_ETH, balanceUSDT_BNB]);

  useEffect(() => {
    if (address && chainId) {
      const apiKeyETH = "H2VYXD5EX8DFPK34DY8TW2JDA1FHEAVQT7";
      const apiKeyBSC = "HKDUN68PC45B9SK7XI1CW8VNQCG127HMY9";
      let urlUSDT, tokenAddressUSDT;

      if (chainId === 1) {
        tokenAddressUSDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        urlUSDT = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddressUSDT}&address=${address}&tag=latest&apikey=${apiKeyETH}`;
      } else if (chainId === 56) {
        tokenAddressUSDT = "0x55d398326f99059fF775485246999027B3197955";
        urlUSDT = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenAddressUSDT}&address=${address}&tag=latest&apikey=${apiKeyBSC}`;
      } else {
        // Logique pour gérer le cas où chainId n'est ni 1 ni 56
        console.error('Unsupported network');
        return;
      }

      if (urlUSDT) {
        fetch(urlUSDT)
            .then(response => response.json())
            .then(data => {
              const balanceUSDT = data.result;
              const balanceInUSDT = ethers.utils.formatUnits(balanceUSDT, 6);
              setUsdtBalance(balanceInUSDT);
            })
            .catch(error => console.error('Error fetching wallet balance in USDT:', error));
      }
    }
  }, [address, chainId]);


  const pushToDataLayer = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'connect_wallet_clicked',
      date: new Date().toISOString(),
      // Autres propriétés si nécessaire
    });
  };

  const getClaimTokenAmount = async (address: string) => {
    if (address) {
      console.log(address);
      let tokenAmount =
        Number(await presaleContract.getClaimAmount(address)) / 1e18;
      setClaimTokenAmount(tokenAmount);
    }
  };

  useEffect(() => {
    const getClaimstatus = async () => {
      let status = await presaleContract.getClaimStatus();
      setClaim(status);
    };

    getClaimTokenAmount(address || "");
    getClaimstatus();
  }, [address]);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Écouter les changements de chaîne
      window.ethereum.on('chainChanged', (_chainId: string) => {
        setChainId(parseInt(_chainId, 16));
      });

      // Récupérer le chainId initial
      provider.getNetwork().then(network => {
        setChainId(network.chainId);
      });

      // Récupérer le solde en ETH
      if (address) {
        provider.getBalance(address).then(balance => {
          setEthBalance(ethers.utils.formatEther(balance));
        });
      }
    }

    // Nettoyage de l'écouteur d'événements
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [address]);

  const onPayAmountChange = (e: any) => {
    try {
      if (e.target.value === "") {
        setPayAmount(0);
        setTokenAmount(0);
      } else {
        let amount = e.target.value;
        amount = amount.toString().replace(/^0+/, "");
        if (amount.length === 0) amount = "0";
        if (amount[0] === ".") amount = "0" + amount;
        setTokenAmount(amount * tokenPrice);
        setTokenUsdtAmount(amount * tokenUsdtPrice);
        setPayAmount(amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signer = useEthersSigner();
  console.log("signer", signer);
  const onBuy = async () => {
    try {
      if (payAmount <= 0) {
        NotificationManager.error("Please input ETH amount");
        return;
      }

      // const prov = new ethers.providers.Web3Provider(provider);
      // let signer = await prov.getSigner();
      if (!signer) return;
      let signedPresaleContract = presaleContract.connect(signer);
      if (tapState === 1) {
        let tx = await signedPresaleContract.buy({
          value: toBigNum(payAmount, 18),
        });
        await tx.wait();
      } else if (tapState === 2) {
        let signedUSDTContract = usdtContract.connect(signer);
        await signedUSDTContract.approve(
          presaleContract.address,
          payAmount * 1e6
        );
        await presaleContract.buyWithUSDT(payAmount * 1e6);
      }
      NotificationManager.success("Buy Success");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User Rejected transaction.");
      else NotificationManager.error("Insufficient funds.");
      console.log("error ----------->", error["code"]);
    }
  };

  const onClaim = async () => {
    try {
      if (!isClaim) {
        NotificationManager.error("Claim is not allowed yet.");
        return;
      }
      if (claimTokenAmount <= 0) {
        NotificationManager.error("Please input token amount");
        return;
      }
      if (!signer) return;
      let signedPresaleContract = presaleContract.connect(signer);
      let tx = await signedPresaleContract.claimUserToken();
      await tx.wait();
      NotificationManager.success("Claim Success");
    } catch (error: any) {
      if (error["code"] === "ACTION_REJECTED")
        NotificationManager.error("User Rejected transaction.");
      else NotificationManager.error("Claim Error.");
      console.log("error ----------->", error["code"]);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span>Countdown completed!</span>;
    } else {
      return (
          <div className="flex justify-center items-center space-x-2 text-[beige] text-[18px]">
            <span className="stone-block">{days}d</span>:
            <span className="stone-block">{hours}h</span>:
            <span className="stone-block">{minutes}m</span>:
            <span className="stone-block">{seconds}s</span>
          </div>
      );
    }
  };

  const renderButton = () => {
    if (chainId === 56) { // Chain ID de Binance Smart Chain
      return <><img
          alt=""
          src={bnbIcon}
          className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"/><span
          className="sm:text-[18px] text-[15px] font-bold text-[#e8b67e]">
              BNB
          </span></>;
    } else {
      return <><img
          alt=""
          src={ethIcon}
          className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"/><span
          className="sm:text-[18px] text-[15px] font-bold text-[#e8b67e]">
              ETH
          </span></>;
    }
  };

  const renderLabel = () => {
    if (chainId === 56) { // Chain ID de Binance Smart Chain
      return <> <span className="font-semibold">BNB</span></>;
    } else {
      return <> <span className="font-semibold">ETH</span></>;
    }
  };

  const renderBalance = () => {
    if (tapState === 1) {
      return chainId === 56 ? <>BNB Balance: {balanceBNB}</> : <>ETH Balance: {balanceETH}</>;
    } else if (tapState === 2) {
      return chainId === 56 ? <>USDT Balance: {balanceUSDT_BNB}</> : <>USDT Balance: {balanceUSDT_ETH}</>;
    }
  };

  const renderTokenImage = () => {
    if (chainId === 56) { // Chain ID de Binance Smart Chain
      return <img
          alt=""
          src={bnbIcon}
          className="w-full h-full"
      />;
    } else {
      return <img
          alt=""
          src={ethIcon}
          className="w-full h-full"
      />;
    }
  };


  const renderButtonSwitchNetwork = () => {
    if (chainId === 1) { // Chain ID de Binance Smart Chain
      return <><img
          alt=""
          src={bnbIcon}
          className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"/><span
          className="sm:text-[18px] text-[15px] font-bold text-[#22361B]">
              Buy on BSC
          </span></>;
    } else {
      return <><img
          alt=""
          src={ethIcon}
          className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"/><span
          className="sm:text-[18px] text-[15px] font-bold text-[#22361B]">
              Buy on ETH
          </span></>;
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        if (chainId === 1) { // Si sur Ethereum, passer à BSC
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // 0x38 est l'ID de chaîne hexadécimal pour BSC
          });
        } else if (chainId === 56) { // Si sur BSC, passer à Ethereum
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // 0x1 est l'ID de chaîne hexadécimal pour Ethereum
          });
        }
      } catch (switchError) {
        // Gérer l'erreur ici (par exemple, l'utilisateur refuse de changer de réseau)
        console.error('Network switch error:', switchError);
      }
    }
  };


  return (
    <div className="pt-[30px] px-0 pb-[60px] hero-container">
      <div className="hero" id="about">
        <div className="hero__wrap">
          <div className="buy-box max-w-[500px] w-full flex flex-col gap-[50px] text-[#e8b67e] h-[100%]">
            <div className="flex flex-col gap-[30px] p-[5px] bg-[#22361B] rounded-lg border-[2px] border-solid boder-[#d4dadf]">
              <div className="hero-header rounded-lg p-[25px] font-semibold text-center text-[#22361B] text-[20px]">
                NEXT PRICE INCREASE IN
                <Countdown
                    date={deadline}
                    renderer={renderer}
                    onComplete={countdownComplete}
                />
              </div>
              <div className="flex flex-col gap-[20px] px-[20px]">
                <div className="font-semibold text-center text-[#e8b67e]">
                  Total Sold: {Math.floor(totalSaled).toLocaleString()}
                  /1,000,000,000
                </div>
                <ProgressBar value={progressStatus} assistiveText="test"/>
                <div className="relative">
                  <div className="px-[30px] text-[15px] font-semibold text-center">
                    {renderBalance()}
                  </div>
                  <Divider className="absolute w-full top-[50%]" />
                </div>
                <div className="grid grid-cols-2 gap-[10px]">
                  <div
                      onClick={() => {
                        setTapState(1);
                      }}
                      className={`cursor-pointer bg-[#22361B] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75 ${
                          tapState === 1 ? "border-[2px] border-[#e8b67e]" : ""
                      }`}
                  >
                    {renderButton()}
                  </div>

                  <div
                      onClick={() => {
                        setTapState(2);
                      }}
                      className={`cursor-pointer bg-[#22361B] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75 ${
                          tapState === 2 ? "border-[2px] border-[#e8b67e]" : ""
                      }`}
                  >
                    <img
                      alt=""
                      src={usdtIcon}
                      className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"
                    />
                    <span className="sm:text-[18px] text-[15px] font-bold text-[#e8b67e]">
                      USDT
                    </span>
                  </div>



                 {/* <div
                      className={`cursor-pointer bg-[#22361B] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75`}
                  >
                    <a
                      href="https://freelancer.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        alt=""
                        src={stakeIcon}
                        className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"
                      />
                      <span className="sm:text-[18px] text-[15px] font-bold">
                        Stake
                      </span>
                    </a>
                  </div>*/}
                </div>

                <div className="grid grid-cols-1 gap-[10px]">
                  <div
                      onClick={() => {
                        setTapState(3);
                      }}
                      className={`cursor-pointer bg-[#e8b67e] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75 ${
                          tapState === 3 ? "border-[2px] border-[#3980B9]" : ""
                      }`}
                  >
                    <img
                        alt=""
                        src={claimIcon}
                        className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"
                    />
                    <span className="sm:text-[18px] text-[15px] font-bold text-[#22361B]">
                      Claim
                    </span>
                  </div>
                  <div className="px-[30px] text-[15px] font-semibold text-center">
                    {/*1 $JUM = $0.00001*/}
                    1 $JUM = $0.01
                  </div>

                  {/* <div
                      className={`cursor-pointer bg-[#22361B] h-[44px] flex justify-center items-center p-[5px] rounded-md hover:opacity-75`}
                  >
                    <a
                      href="https://freelancer.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        alt=""
                        src={stakeIcon}
                        className="h-[15px] w-[15px] sm:h-[25px] sm:w-[25px]  rounded-full"
                      />
                      <span className="sm:text-[18px] text-[15px] font-bold">
                        Stake
                      </span>
                    </a>
                  </div>*/}
                </div>

                {tapState < 3 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                          <span className="text-[15px] opacity-80">
                            Amount in{" "}
                            {tapState === 1 ? (
                              <span className="font-semibold">{renderLabel()}</span>
                            ) : (
                              <span className="font-semibold">USDT</span>
                            )}{" "}
                            you pay
                          </span>
                        </div>

                        <div className="relative h-[50px] flex flex-row items-center px-[10px] bg-bgLight rounded-md">
                          <input
                            value={payAmount}
                            className="default-input text-black"
                            onChange={onPayAmountChange}
                          />

                          <div className="absolute right-[10px] w-[30px] h-[30px]">
                            {tapState === 1 ? (renderTokenImage()

                            ) : (
                              <img
                                alt=""
                                src={usdtIcon}
                                className="w-full h-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                          <span className="text-[15px] opacity-80">
                            <span className="font-semibold">$JUM </span> you
                            receive
                          </span>
                        </div>

                        <div className="relative h-[50px] flex flex-row items-center px-[5px] bg-bgLight rounded-md">
                          {tapState === 1 ? (
                            <input
                              value={tokenAmount.toFixed(3)}
                              className="default-input text-black"
                              readOnly
                            />
                          ) : (
                            <input
                              value={tokenUsdtAmount.toFixed(3)}
                              className="default-input text-black"
                              readOnly
                            />
                          )}{" "}
                          <div className="absolute right-[10px] w-[30px] h-[30px]">
                            <img
                              alt=""
                              src={slideLogo}
                              className="w-full h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[15px] text-center">
                      0.015 ETH is reserved for gas.
                    </div>

                    {address && (
                        <>
                          <div className="flex flex-row justify-center items-center">
                            <div
                                className="w-[70%] py-[10px] bg-[#e8b67e] text-center rounded-full cursor-pointer hover:opacity-75 select-none"
                                onClick={onBuy}
                            >
                              <span className="text-[#22361B] text-[18px] sm:text-[18px]"><b>Buy</b></span>
                            </div>

                          </div>
                          <div className="flex flex-row justify-center items-center">
                          <div
                              onClick={switchNetwork}
                              className={`w-[70%] py-[10px] rounded-full cursor-pointer bg-[#e8b67e]  flex justify-center items-center select-none p-[5px] hover:opacity-75 text-["#22361B"]
                              }`}
                          >
                            {renderButtonSwitchNetwork()}
                          </div>
                          </div>
                        </>
                    )}
                  </>
                )}
                {tapState === 3 && (
                  <>
                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between">
                        <span className="text-[15px] opacity-80">
                          Token Amount that you will can claim.
                        </span>
                      </div>

                      <div className="relative h-[50px] flex flex-row items-center px-[5px] bg-bgLight rounded-md">
                        <input
                          type="number"
                          value={claimTokenAmount}
                          className="default-input flex-1"
                          readOnly
                        />

                        <div className="w-[30px] h-[30px]">
                          <img
                            alt=""
                            src={slideLogo}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    {!isClaim && (
                      <div className="text-[13px] text-center text-yellow-300-500">
                        🛈 Stake will be available soon !
                      </div>
                    )}

                    {address && (
                      <div className="flex flex-row justify-center  items-center">
                        <div
                          onClick={onClaim}
                          className={`w-[70%] py-[10px] bg-[#e8b67e] text-center rounded-full cursor-pointer hover:opacity-75 select-none ${
                            isClaim ? "bg-[#e8b67e]" : "bg-[#e8b67e]"
                          }`}
                        >
                          <span className="text-[#22361B] text-[15px]"><b>Claim</b></span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {address && (
                  <div className="flex flex-row justify-center items-center">
                    <div
                      onClick={toggleOpen}
                      className="w-[70%] py-[10px] border border-borderColor text-center rounded-full cursor-pointer hover:opacity-75 select-none"
                    >
                      <span className="text-[15px]">
                        {getSubString(address || "")}
                      </span>
                    </div>
                  </div>
                )}
                {!address && (
                  <div className="flex flex-row justify-center items-center">
                    <div
                      onClick={() => {
                        toggleOpen();
                        pushToDataLayer();
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
    </div>
  );
}
