// Navbar.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import logoImg from "../asserts/images/logo.png";
import logoImg from "../asserts/images/LogoSimpleLendBook_green4.png";
import { formatNumber } from "../components/GlobalFunctions";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "../context/ThemeContext";
import { Switch } from "@headlessui/react";
import { useChangePriceFeed } from "../hooks/useChangePriceFeed";
//import { useDataContext } from "../context/DataContext";

export default function Navbar() {
  //const { price, priceLoading, refetchData } = useDataContext();
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-30 shadow-md ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center justify-center">
            <Link to="/">
              <img className="h-10 w-auto" src={logoImg} alt="Logo" />
            </Link>
            <span
              className={`font-bold ${
                darkMode ? "text-primary" : "text-black"
              } text-xl ml-2`}
            >
              LendBook
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-white`}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch> */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
