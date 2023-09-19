import { useState, useEffect } from "react";

import Container from "./Containerr";
import buyCat from "../asserts/images/buy-cat.svg";
import { useMediaQuery } from "react-responsive";

export default function Buy() {
  const isMobile = useMediaQuery({ maxWidth: 480 });

  return (
    <div className="bg-[#0C2349] py-[28px]">
      <Container>
        <div className="flex flex-col gap-[30px]">
          <div className="grid sm:grid-cols-2 gap-[10px]">
            <div className="flex justify-center flex-col">
              <img src={buyCat} alt="buy cat" className="w-[490px]" />
            </div>
            <div className="flex  flex-col justify-center text-white text-center sm:text-right gap-[20px] py-[70px] font-[GothamPro-Regular]">
              <div className="uppercase flex justify-center font-bold text-white font-[Cocogoose] text-[48px] leading-[60px]">
                <span>Buy Shiba Memu (SHMU) Right Now!</span>
              </div>
              <p className="text-[18px] text-white">
                Ready to take a leap from the precipice of today into a rather
                cute dog-focused future? Shiba Memu aims to grow. Not slowly
                like a cactus. Think viral content, off-the-scale charts,
                moments where you wished you’d bought at yesterday’s price…
              </p>
              <p className="text0-[18px] text-white">
                The project aims to deliver long-term investment potential for
                hodlers, and delicious returns for the savvy day trader. In
                short, don’t miss out on this one, like you missed out on that
                last opportunity.
              </p>
              <div className="flex justify-center sm:justify-start shmu-connect-button ">
                <button className="text-white bg-[#FF7121] border-[#FF7121] px-[30px] py-[11px] font-bold rounded-[16px] buy-btn">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
