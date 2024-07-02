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
const Dashboard = lazy(() => import("./views/Dashboard/Index"));
const AnalyticsPage = lazy(() => import("./views/Analytics/Index"));
const InakiTest = lazy(() => import("./views/InakiTest/Index"));
const Lend = lazy(() => import("./views/Lend/Index"));
const Template = lazy(() => import("./views/Template/Index"));
const BorrowNew = lazy(() => import("./views/BorrowNew/Index"));

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
                path="dashboard"
                element={
                  <Suspense fallback={<Loading />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="inakitest"
                element={
                  <Suspense fallback={<Loading />}>
                    <InakiTest />
                  </Suspense>
                }
              />
              <Route
                path="template"
                element={
                  <Suspense fallback={<Loading />}>
                    <Template />
                  </Suspense>
                }
              />
              <Route
                path="borrownew"
                element={
                  <Suspense fallback={<Loading />}>
                    <BorrowNew />
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
