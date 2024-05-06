// src/layouts/LandingLayout.tsx

import { lazy, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";

const Navbar = lazy(() => import("./Navbar"));
const MenuBar = lazy(() => import("./MenuBar"));
const Footer = lazy(() => import("./Footer"));

export default function LandingLayout() {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ minWidth: 480, maxWidth: 768 });
  const isLaptop = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1280 });

  useEffect(() => {}, [isMobile, isTablet, isLaptop, isDesktop]);

  return (
    <>
      <Navbar /> {/* Navbar first, covering the full width at the top */}
      <div className="min-h-screen flex flex-row relative">
        <MenuBar /> {/* MenuBar on the left under the Navbar */}
        <div
          className="flex flex-col flex-grow"
          style={{
            //minWidth: "500px",
            overflowX: "auto",
          }}
        >
          <main className="flex-grow">
            <Outlet /> {/* Dynamic content rendered here */}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
