// Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../asserts/images/logo.png";
import { usePriceOracle } from "../hooks/usePriceOracle";
import { formatNumber } from "../components/GlobalFunctions";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTheme } from "../context/ThemeContext";
import { Switch } from "@headlessui/react";

export default function Navbar() {
  const { price, loading } = usePriceOracle();
  const { darkMode, toggleDarkMode } = useTheme();

  // Oracle update
  const [buttonClickable, setButtonClickable] = useState<boolean>(false);
  const [updatedOraclePrice, setUpdatedOraclePrice] = useState<number>(0);
  const handleOraclePriceChange = (newPrice: string) => {
    setUpdatedOraclePrice(parseFloat(newPrice));
    updateButtonPriceClickable(parseFloat(newPrice));
  };
  const updateButtonPriceClickable = (newPrice: number) => {
    if (price) {
      if (newPrice === 0 || isNaN(newPrice)) {
        setButtonClickable(false);
      } else {
        setButtonClickable(false);
        if (newPrice !== parseFloat(formatNumber(price))) {
          setButtonClickable(true);
        }
      }
    }
  };
  const handleButtonClick = () => {
    console.log("clicked");
  };

  return (
    <nav className={`w-full fixed top-0 left-0 z-30 shadow-md ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <img className="h-10 w-auto" src={logoImg} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center flex-grow justify-center">
            <span className={`text-info text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
              Oracle Price: 1 WETH = {loading ? "Loading..." : price ? formatNumber(price) : "0"} USDC
            </span>
            <input
              type="number"
              placeholder="Enter amount"
              value={updatedOraclePrice}
              onChange={(e) => handleOraclePriceChange(e.target.value)}
              className={`ml-4 p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              style={{ width: '200px', height: '40px' }}
            />
            <button
              onClick={handleButtonClick}
              disabled={!buttonClickable}
              className={`ml-2 p-2 border border-gray-300 rounded ${buttonClickable ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
              style={{ height: '40px' }}
            >
              Update
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full border-2 border-white`}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
