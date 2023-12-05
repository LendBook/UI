import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Loading from "./components/Loading";
import { Web3Modal } from "@web3modal/react";
import {mainnet, bsc, bscTestnet, fantomTestnet} from "wagmi/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ToastContainer } from "react-toastify";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Analytics } from '@vercel/analytics/react';
import Routes from "./routes";
import ReactAudioPlayer from 'react-audio-player';

const projectId = process.env.REACT_APP_CONNECT_PROJECT_ID || "";
const chains = [mainnet, bsc, bscTestnet, fantomTestnet];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <WagmiConfig config={wagmiConfig}>
          <Routes />
          <Analytics />
          <ToastContainer className="!z-[99999]" />
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <ReactAudioPlayer
            src="./song.mp3"
            autoPlay
            controls
        />
      </Suspense>
      <NotificationContainer />
    </BrowserRouter>
  );
}

export default App;
