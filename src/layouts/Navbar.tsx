import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu } from "@headlessui/react";
import networks from "../config/networks.json";  // Make sure the path is correct
import logoImg from "../asserts/images/logo.png";  // Make sure the path is correct
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from "wagmi";

export default function Navbar() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const [currentNetwork, setCurrentNetwork] = useState(networks[0]);  // Default to first network

  useEffect(() => {
    const network = networks.find(n => n.chainID === chain?.id);
    if (network) setCurrentNetwork(network);
  }, [chain]);

  const truncateAddress = (address: string | undefined) => address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  return (
      <nav className="bg-white text-black w-full fixed top-0 left-0 z-30 shadow-md">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-10 w-auto" src={logoImg} alt="Logo"/>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <button
                    onClick={() => isConnected ? disconnect() : open()}
                    className="inline-flex items-center px-4 py-2 border border-[#003f7d] text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {isConnected ? truncateAddress(address) : "Connect Wallet"}
                </button>
              </div>
              <div className="relative">
                <Menu as="div" className="ml-4 text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md border border-[#003f7d] hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <img src={currentNetwork.logourl} className="h-5 w-5 mr-2" alt="Network Logo"/>
                      <Icon icon="heroicons-solid:chevron-down" className="h-5 w-5" aria-hidden="true"/>
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
                                    className={`${active ? 'bg-gray-100' : 'text-gray-900'} flex justify-center w-full px-4 py-2 text-sm text-gray-900`}
                                >
                                  <img src={network.logourl} alt={network.Name} className="h-5 w-5"/>
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
