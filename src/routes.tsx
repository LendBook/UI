import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import LandingLayout from "./layouts";

// Import components
const Home = lazy(() => import("./components/Markets/Markets"));
const Borrow = lazy(() => import("./components/Borrow/Index"));
const Trade = lazy(() => import("./components/Trade/Index"));
const Deposit = lazy(() => import("./components/Deposit/Index"));
const Markets = lazy(() => import("./components/Markets/Markets"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Faucet = lazy(() => import("./components/Faucet/Faucet"));
const About = lazy(() => import("./components/About"));
const InakiTest = lazy(() => import("./components/InakiTest/Index"));
const Lend = lazy(() => import("./components/Lend/Index"));
const Template = lazy(() => import("./components/Template/Index"));
// ----------------------------------------------------------------------------------

export default function Routes() {
  return useRoutes([
    {
      path: "",
      element: <LandingLayout />,
      children: [
        {
          path: "/",
          element: <Markets />,
        },
        {
          path: "/markets",
          element: <Markets />,
        },
        {
          path: "/lend",
          element: <Lend />,
        },
        {
          path: "/trade",
          element: <Trade />,
        },

        {
          path: "/deposit",
          element: <Deposit />,
        },
        {
          path: "/borrow",
          element: <Borrow />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/faucet",
          element: <Faucet />,
        },
        {
          path: "/inakitest",
          element: <InakiTest />,
        },
        {
          path: "/template",
          element: <Template />,
        },
      ],
    },
  ]);
}
