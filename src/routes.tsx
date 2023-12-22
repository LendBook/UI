import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import LandingLayout from "./layouts";

// Import components
const Trade = lazy(() => import("./components/Trade"));
const Borrow = lazy(() => import("./components/Borrow"));
const Orderbook = lazy(() => import("./components/Orderbook"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const About = lazy(() => import("./components/About"));
// ----------------------------------------------------------------------------------

export default function Routes() {
  return useRoutes([
    {
      path: "",
      element: <LandingLayout />,
      children: [
        {
          path: "/",
          element: <Trade />,
        },
        {
          path: "/orderbook",
          element: <Orderbook />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/trade",
          element: <Trade />,
        },
        {
          path: "/borrow",
          element: <Borrow />,
        },
        {
          path: "/about",
          element: <About />,
        },
      ],
    },
  ]);
}
