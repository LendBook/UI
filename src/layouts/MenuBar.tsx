// MenuBar.tsx
import { Link } from "react-router-dom";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import pairs from "../config/constants/pair.json";
import MENU_LINKS from "../config/constants/menu";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import StyledRouterButton from "../components/buttons/StyledRouterButton";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuBar() {
  const { darkMode } = useTheme();
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const location = useLocation(); //useLocation to get current path
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  useEffect(() => {
    // find the link to the current path
    const currentMenu = MENU_LINKS.find(
      (menu) => menu.to === location.pathname
    );
    if (currentMenu) {
      setSelectedMenu(currentMenu.id);
    }
  }, [location.pathname]);

  const StyledButton = styled(StyledRouterButton)(({ theme }) => ({
    marginBottom: theme.spacing(1), // Equivalent to Tailwind's mb-4
    width: "90%", // Make the button take full width
    justifyContent: "flex-start", // Align text to the left
    padding: theme.spacing(0.5), // Equivalent to Tailwind's p-4
    borderRadius: theme.shape.borderRadius, // Default border radius
    textTransform: "none",
    border: "1px solid transparent",
    "&:hover": {
      border: "1px solid transparent", // Ensure border remains transparent on hover
      backgroundColor: darkMode ? "grey.600" : "grey.300", // Example of hover background color change
    },
    color: darkMode ? "white" : "black",
    "&.MuiButton-containedPrimary": {
      boxShadow: "none", // Remove box shadow on contained primary button
      "&:hover": {
        boxShadow: "none", // Remove box shadow on hover for contained primary button
      },
    },
  }));

  return (
    <div
      className={`w-64 fixed top-16 left-0 h-full z-10 shadow-md ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col pt-2">
        <div className="px-4 py-2">
          <Menu as="div" className="relative inline-block text-left w-full">
            <div>
              <Menu.Button
                className={`group w-full rounded-md px-3.5 py-2 text-sm text-left font-medium ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-between items-center`}
              >
                {selectedPair ? (
                  <>
                    <img
                      src={selectedPair.logourlA}
                      alt={selectedPair.tokenA}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                    {selectedPair.tokenA} /
                    <img
                      src={selectedPair.logourlB}
                      alt={selectedPair.tokenB}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginLeft: "4px",
                        marginRight: "4px",
                      }}
                    />
                    {selectedPair.tokenB}
                  </>
                ) : (
                  "Select Pair"
                )}
                <Icon
                  icon="heroicons-solid:chevron-down"
                  className="ml-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="py-1 flex flex-wrap">
                  {pairs.map((pair) => (
                    <Menu.Item key={pair.chainID}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedPair(pair)}
                          className={classNames(
                            active
                              ? darkMode
                                ? "bg-gray-700"
                                : "bg-gray-100"
                              : "",
                            "inline-flex items-center px-4 py-2 text-sm w-full text-left"
                          )}
                          style={{ display: "inline-flex", marginRight: "4px" }}
                        >
                          <img
                            src={pair.logourlA}
                            alt={pair.tokenA}
                            style={{
                              height: "20px",
                              width: "20px",
                              marginRight: "4px",
                            }}
                          />
                          {pair.tokenA} /
                          <img
                            src={pair.logourlB}
                            alt={pair.tokenB}
                            style={{
                              height: "20px",
                              width: "20px",
                              marginLeft: "4px",
                            }}
                          />
                          {pair.tokenB}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <nav className="flex flex-col items-center justify-center">
          {MENU_LINKS.map((menu) => (
            <StyledButton
              key={menu.id}
              to={menu.to}
              onClick={() => setSelectedMenu(menu.id)}
              sx={{
                backgroundColor:
                  selectedMenu === menu.id
                    ? darkMode
                      ? "grey.700"
                      : "grey.200"
                    : undefined,
                fontWeight: selectedMenu === menu.id ? "bold" : "normal",
              }}
            >
              {menu.label}
            </StyledButton>
          ))}
        </nav>
      </div>
    </div>
  );
}
