import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu } from "@headlessui/react";
import networks from "../config/testnet.json";
import pairs from "../config/pairs.json";
import logoImg from "../asserts/images/logo.png";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from "wagmi";
import { usePriceOracle } from "../hooks/usePriceOracle";
import { formatNumber } from "../components/GlobalFunctions";

export default function Navbar() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const [currentNetwork, setCurrentNetwork] = useState(networks[0]);

  useEffect(() => {
    const network = networks.find((n) => n.chainID === chain?.id);
    if (network) setCurrentNetwork(network);
  }, [chain]);

  const truncateAddress = (address: string | undefined) =>
    address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : "";

  const tokenPair = pairs.find(
    (pair) => pair.tokenA === "WETH" && pair.tokenB.trim() === "USDC"
  );

  const { price, loading, error } = usePriceOracle();

  return (
    <nav
      className="bg-white text-black w-full fixed top-0 left-0 z-30 shadow-md"
      style={{ zIndex: 9999 }}
    >
      <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-10 w-auto" src={logoImg} alt="Logo" />
            </Link>
          </div>

          {tokenPair && (
            <div className="flex-grow text-center flex flex-col items-center justify-center">
              <div className="flex items-center ">
                <img
                  src={tokenPair.logourlA}
                  alt="WETH Logo"
                  className="h-4 w-4 mr-1"
                />
                <span className="text-info font-medium">
                  {tokenPair.tokenA} /
                </span>
                <img
                  src={tokenPair.logourlB}
                  alt="USDC Logo"
                  className="h-4 w-4 ml-1 mr-1"
                />
                <span className="text-info font-medium">
                  {tokenPair.tokenB.trim()}
                </span>
              </div>
              <span className="text-info text-sm font-medium mt-1">
                Oracle Price : 1 {tokenPair.tokenA} ={" "}
                {loading ? "Loading..." : price ? formatNumber(price) : "0"}{" "}
                {tokenPair.tokenB.trim()}
              </span>
            </div>
          )}

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <button
                onClick={() => (isConnected ? disconnect() : open())}
                className="inline-flex items-center px-4 py-2 border border-bgBtn text-sm font-medium rounded-md text-white bg-bgBtn hover:bg-bgBtnHover"
              >
                {isConnected ? truncateAddress(address) : "Connect Wallet"}
              </button>
            </div>
            <div className="relative">
              <Menu as="div" className="ml-4 text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md border border-primary hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <img
                      src={currentNetwork.logourl}
                      className="h-5 w-5 mr-2"
                      alt="Network Logo"
                    />
                    <Icon
                      icon="heroicons-solid:chevron-down"
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {networks.map((network) => (
                      <Menu.Item key={network.chainID}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              if (switchNetwork) {
                                switchNetwork(network.chainID);
                                setCurrentNetwork(network);
                              }
                            }}
                            className={`${
                              active ? "bg-gray-100" : "text-gray-900"
                            } flex justify-center w-full px-4 py-2 text-sm text-gray-900`}
                          >
                            <img
                              src={network.logourl}
                              alt={network.Name}
                              className="h-5 w-5"
                            />
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
