import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import LandingLayout from "./layouts";

// Import components
const Home = lazy(() => import("./components/Home"));
const Borrow = lazy(() => import("./components/Borrow/Index"));
const Markets = lazy(() => import("./components/Markets/Markets"));
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
          element: <Markets/>,
        },
        {
          path: "/markets",
          element: <Markets />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/trade",
          element: <Home />,
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
