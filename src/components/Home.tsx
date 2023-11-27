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
import backgroundImage from '../asserts/images/background/8.png';
export default function Home() {
  return (
      <div
          style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      <Hero />
      {/*<Brand />*/}
      {/*<About />*/}
      <Buy />
      {/*<Exchange />*/}
      {/* <Earn/> */}
      <Roadmap />
      {/*<Daashboard />*/}
      <How />
      {/*<ShibaBuy />*/}
      {/*<FAQ />*/}
    </div>
  );
}
