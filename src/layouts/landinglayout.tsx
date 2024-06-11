// LandingLayout.tsx
import React, { lazy, useEffect, Suspense } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext"; 

const Navbar = lazy(() => import("./Navbar"));
const MenuBar = lazy(() => import("./MenuBar"));

export default function LandingLayout() {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ minWidth: 480, maxWidth: 768 });
  const isLaptop = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1280 });

  useEffect(() => {}, [isMobile, isTablet, isLaptop, isDesktop]);

  return (
    <ThemeProvider>
      <Suspense fallback={<div></div>}>
        <Navbar />
      </Suspense>
      <div className="min-h-screen flex flex-row relative">
        <Suspense fallback={<div></div>}>
          <MenuBar />
        </Suspense>
        <div
          className="flex flex-col flex-grow"
          style={{
            overflowX: "auto",
          }}
        >
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
