import {useEffect, useState, useRef} from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from "wagmi";
import { Drawer, List, ListItem } from "@material-tailwind/react";
import Container from "../components/Container";
import FilledButton from "../components/buttons/FilledButton";
import TextIconButton from "../components/buttons/TextIconButton";
import TextButton from "../components/buttons/TextButton";
import logoImg from "../asserts/images/logo.svg";
import "../asserts/scss/custom.scss";


const chainId = process.env.REACT_APP_CHAIN_ID;

// -----------------------------------------------------------------------------------------

interface INavLink {
  id: number;
  label: string;
  to: string;
}

// -----------------------------------------------------------------------------------------

const NAV_LINKS: Array<INavLink> = [
  {
    id: 1,
    label: "Markets",
    to: "/markets",
  },
  {
    id: 2,
    label: "Trade",
    to: "/trade",
  },
  {
    id: 2,
    label: "Deposit",
    to: "/deposit",
  },
  {
    id: 3,
    label: "Borrow",
    to: "/borrow",
  },
  {
    id: 4,
    label: "My Positions",
    to: "/dashboard",
  },
  {
    id: 5,
    label: "Faucet",
    to: "/faucet",
  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const { address } = useAccount();

  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);

  const closeDrawer = () => {
    setVisibleDrawer(false);
  };

  const navigateToPage = (to: string) => {
    navigate(to);
    closeDrawer();
  };

  return (
      <nav className="top-0 left-0 right-0 z-[99]">
      <Container className="justify-between p-4 hidden lg:flex">
        {/* Logo à gauche */}
        <div className="flex items-center">
          <a href="/#" className="w-[180px] h-[76px]">
            <img src={logoImg} alt="logo" className="w-full" />
          </a>
        </div>

        {/* Liens de navigation au centre */}
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((linkItem) => (
              <a key={linkItem.id} href={linkItem.to} className={pathname === linkItem.to ? "active-link" : ""}>
                <TextButton
                    className={`gap-2 font-[GothamPro-Regular] text-[17] ${
                        pathname === linkItem.to ? "text-gray-100" : "text-white"
                    }`}
                >
                  {linkItem.label}
                </TextButton>
              </a>

          ))}
        </div>

        <div className="flex items-center">
          {isConnected ? (
              chain?.id === Number(chainId) ? (
                  <FilledButton
                      className="font-[GothamPro-Bold] flex items-center gap-1"
                      onClick={() => disconnect()}
                  >
                    <Icon icon="mdi:wallet-outline" className="text-xl" />
                    Disconnect
                  </FilledButton>
              ) : (
                  <FilledButton
                      className="font-[GothamPro-Bold] flex items-center gap-1"
                      onClick={() => switchNetwork?.(Number(chainId))}
                  >
                    <Icon icon="mdi:wallet-outline" className="text-xl" />
                    Switch mainnet
                  </FilledButton>
              )
          ) : (
              <FilledButton
                  className="font-[GothamPro-Bold] flex items-center gap-1"
                  onClick={() => {
                    open();
                  }}
              >
                <Icon id="connect-wallet" icon="mdi:wallet-outline" className="text-xl" />
                Connect Wallet
              </FilledButton>
          )}
        </div>
      </Container>

      <Container className="justify-between items-center p-4 flex lg:hidden">
        <Link to="/">
          <img src={logoImg} alt="logo" className="w-full" />
        </Link>

        <TextIconButton
          className="flex justify-center items-center"
          onClick={() => setVisibleDrawer(true)}
        >
          <Icon icon="ion:menu" className="text-xl" />
        </TextIconButton>
      </Container>
      <Drawer
        open={visibleDrawer}
        onClose={closeDrawer}
        className="p-4 bg-gray-900"
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <a href="/">
              <img src={logoImg} alt="logo" className="w-8" />
            </a>

            <TextIconButton onClick={closeDrawer}>
              <Icon icon="akar-icons:cross" className="text-xl" />
            </TextIconButton>
          </div>
          <List>
            {NAV_LINKS.map((linkItem) => (
                <a key={linkItem.id} href={linkItem.to} className={pathname === linkItem.to ? "active-link" : ""}>
                  <TextButton
                      className={`gap-2 font-[GothamPro-Regular] text-[17] ${
                          pathname === linkItem.to ? "text-gray-100" : "text-white"
                      }`}
                  >
                    {linkItem.label}
                  </TextButton>
                </a>

            ))}
          </List>
          <List>
            {isConnected ? (
              chain?.id === Number(chainId) ? (
                <ListItem
                  className="gap-4 text-gray-100 font-[GothamPro-Bold]"
                  onClick={() => disconnect()}
                >
                  <Icon icon="mdi:wallet-outline" className="text-xl" />
                  Disconnect
                </ListItem>
              ) : (
                <ListItem
                  className="gap-4 text-gray-100 font-[GothamPro-Bold]"
                  onClick={() => switchNetwork?.(Number(chainId))}
                >
                  <Icon icon="mdi:wallet-outline" className="text-xl" />
                  Switch network
                </ListItem>
              )
            ) : (
              <ListItem
                className="gap-4 text-gray-100 font-[GothamPro-Bold]"
                onClick={() => {
                  open();
                }}
              >
                <Icon id="connect-wallet" icon="mdi:wallet-outline" className="text-xl" />
                Connect Wallet
              </ListItem>

            )}
          </List>
          <div>
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
