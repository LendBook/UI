import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useEthersSigner } from "./hooks/useEthersSigner";
import { Web3Modal } from "@web3modal/react";
import { mainnet, bsc, bscTestnet, fantomTestnet } from "wagmi/chains";
import { blast } from "./utils/blastTestnet";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ToastContainer } from "react-toastify";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Loading from "./components/Loading";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/index';
import LandingLayout from "./layouts/landinglayout";

// Import components
const Home = lazy(() => import('./components/Markets/Markets'));
const Borrow = lazy(() => import('./components/Borrow/Index'));
const Trade = lazy(() => import('./components/Trade/Index'));
const Deposit = lazy(() => import('./components/Deposit/Index'));
const Markets = lazy(() => import('./components/Markets/Markets'));
const Dashboard = lazy(() => import('./components/Dashboard/Index'));
const AnalyticsPage = lazy(() => import('./components/Analytics/Index'));
const Faucet = lazy(() => import('./components/Faucet/Faucet'));
const InakiTest = lazy(() => import('./components/InakiTest/Index'));
const Lend = lazy(() => import('./components/Lend/Index'));
const Template = lazy(() => import('./components/Template/Index'));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const projectId = process.env.REACT_APP_CONNECT_PROJECT_ID || "";
const chains = [mainnet, bsc, bscTestnet, fantomTestnet, blast];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const App = () => {
  const { account, connect } = useEthersSigner();

  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect();
    }
  }, [account, connect]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <WagmiConfig config={wagmiConfig}>
            <Routes>
              <Route path="/" element={<LandingLayout />}>
                <Route index element={<Home />} />
                <Route path="markets" element={<Markets />} />
                <Route path="lend" element={<Lend />} />
                <Route path="trade" element={<Trade />} />
                <Route path="deposit" element={<Deposit />} />
                <Route path="borrow" element={<Borrow />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="faucet" element={<Faucet />} />
                <Route path="inakitest" element={<InakiTest />} />
                <Route path="template" element={<Template />} />
              </Route>
            </Routes>
            <ToastContainer className="!z-[99999]" />
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </WagmiConfig>
          <NotificationContainer />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default React.memo(App);
