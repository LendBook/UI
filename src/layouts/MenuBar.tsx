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
import theme from "../theme";
import { menu } from "@material-tailwind/react";
import { inherits } from "util";
import { formatNumber } from "../components/GlobalFunctions";
import { useDataContext } from "../context/DataContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuBar() {
  const { price, priceLoading } = useDataContext();
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
      //border: "1px solid transparent", // Ensure border remains transparent on hover
      backgroundColor: darkMode ? "grey.600" : `${theme.palette.error.main}`, // Example of hover background color change
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
        <nav className="flex flex-col items-center justify-center">
          {MENU_LINKS.map((menu) => (
            <StyledButton
              key={menu.id}
              to={menu.to}
              onClick={() => setSelectedMenu(menu.id)}
              sx={{
                borderRadius: menu.label === "Markets" ? 5 : undefined,
                display: "flex",
                justifyContent: menu.label === "Markets" ? "center" : undefined,

                backgroundColor:
                  selectedMenu === menu.id
                    ? menu.label === "Markets"
                      ? `${theme.palette.primary.main}`
                      : `${theme.palette.error.main}`
                    : menu.label === "Markets"
                    ? `${theme.palette.error.main}`
                    : undefined,
                fontWeight: selectedMenu === menu.id ? "bold" : "normal",
                color:
                  selectedMenu === menu.id && menu.label === "Markets"
                    ? "white"
                    : undefined,
                border:
                  menu.label === "Markets"
                    ? `1px solid ${theme.palette.primary.main}`
                    : "1px solid transparent",
                "&:hover": {
                  backgroundColor:
                    menu.label === "Markets"
                      ? `${theme.palette.primary.main}`
                      : undefined, // Example of hover background color change
                  color: menu.label === "Markets" ? "white" : undefined,
                },
              }}
            >
              {menu.icon && (
                <span style={{ marginRight: "8px" }}>{menu.icon}</span>
              )}

              {menu.label === "Markets" ? (
                <div className="flex flex-col items-center">
                  Market
                  <br />
                  <div className="flex font-bold">
                    {selectedPair ? (
                      <>
                        <img
                          src={selectedPair.logourlB}
                          alt={selectedPair.tokenB}
                          style={{
                            height: "20px",
                            width: "20px",
                            marginRight: "4px",
                          }}
                        />
                        {selectedPair.tokenB} /
                        <img
                          src={selectedPair.logourlA}
                          alt={selectedPair.tokenA}
                          style={{
                            height: "20px",
                            width: "20px",
                            marginLeft: "4px",
                            marginRight: "4px",
                          }}
                        />
                        {selectedPair.tokenA}
                      </>
                    ) : (
                      "Select Pair"
                    )}
                  </div>
                  <div className="flex items-center flex-grow justify-center">
                    <span className={` text-[0.7rem]  `}>
                      Price: 1 WETH ={" "}
                      {priceLoading
                        ? "Loading..."
                        : price
                        ? formatNumber(price)
                        : "0"}{" "}
                      USDC
                    </span>
                  </div>
                </div>
              ) : (
                menu.label
              )}
            </StyledButton>
          ))}
        </nav>
      </div>
    </div>
  );
}
