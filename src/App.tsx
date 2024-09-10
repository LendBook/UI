import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationContainer } from "react-notifications";
import { ThemeProvider } from "@mui/material/styles";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import theme from "./theme/index";
import LandingLayout from "./layouts/landinglayout";
import Loading from "./components/Loading";
import { DataProvider } from "./context/DataContext";

// Import components
const Home = lazy(() => import("./views/Markets/Index"));
const Borrow = lazy(() => import("./views/Borrow/Index"));
const Trade = lazy(() => import("./views/Trade/Index"));
const Markets = lazy(() => import("./views/Markets/Index"));
const AnalyticsPage = lazy(() => import("./views/Analytics/Index"));
const Lend = lazy(() => import("./views/Lend/Index"));
const Mint = lazy(() => import("./views/Mint/Index"));
const UpdatePrice = lazy(() => import("./views/UpdatePrice/Index"));
const Ecosystem = lazy(() => import("./views/Ecosystem/Index"));

const App = () => {
  const { address: walletAddress } = useAccount();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  return (
    <ThemeProvider theme={theme}>
      <DataProvider provider={provider} walletAddress={walletAddress}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="markets"
                element={
                  <Suspense fallback={<Loading />}>
                    <Markets />
                  </Suspense>
                }
              />
              <Route
                path="lend"
                element={
                  <Suspense fallback={<Loading />}>
                    <Lend />
                  </Suspense>
                }
              />
              <Route
                path="trade"
                element={
                  <Suspense fallback={<Loading />}>
                    <Trade />
                  </Suspense>
                }
              />
              <Route
                path="borrow"
                element={
                  <Suspense fallback={<Loading />}>
                    <Borrow />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<Loading />}>
                    <AnalyticsPage />
                  </Suspense>
                }
              />
              <Route
                path="mint"
                element={
                  <Suspense fallback={<Loading />}>
                    <Mint />
                  </Suspense>
                }
              />
              <Route
                path="updateprice"
                element={
                  <Suspense fallback={<Loading />}>
                    <UpdatePrice />
                  </Suspense>
                }
              />
              <Route
                path="ecosystem"
                element={
                  <Suspense fallback={<Loading />}>
                    <Ecosystem />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
          <ToastContainer className="!z-[99999]" />
          <NotificationContainer />
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
};

export default React.memo(App);
