import { useState, useEffect } from "react";
import Hero from "./Hero";
import Brand from "./Brand";
import About from "./About";
import Buy from "./Buy";
import Exchange from "./Exchange";
import Roadmap from "./Rodmap";
import Daashboard from "./Dashboard";
import How from "./How";
import ShibaBuy from "./ShibaBuy";
import FAQ from "./FAQ";
import Earn from "./Earn";
export default function Home() {
  return (
    <div className="bg-[#affff5]">
      <Hero />
      <Brand />
      <About />
      <Buy />
      <Exchange />
      {/* <Earn/> */}
      <Roadmap />
      <Daashboard />
      <How />
      <ShibaBuy />
      <FAQ />
    </div>
  );
}
