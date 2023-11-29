import { useState, useEffect } from "react";

import Container from "./Containerr";
import buyCat from "../asserts/images/buy-cat.svg";
import { useMediaQuery } from "react-responsive";

export default function Buy() {
  const isMobile = useMediaQuery({ maxWidth: 480 });

  return (
    <div className="bg-[#e8b67e] py-[28px]">
      <Container>
        <div className="flex flex-col gap-[30px]">
          <div className="grid sm:grid-cols-2 gap-[10px]">
            <div className="flex justify-center flex-col">
              <img src={buyCat} alt="buy cat" className="w-[490px]" />
            </div>
            <div className="flex  flex-col justify-center text-white text-center sm:text-right gap-[20px] py-[70px] font-[GothamPro-Regular]">
              <div className="uppercase flex justify-center font-bold text-[#22361B] font-[Cocogoose] text-[48px] leading-[60px]">
                <span>Buy JUMANJI (JUM) Right Now!</span>
              </div>
              <p className="text-[18px] text-[#22361B]">
                Ready to dive from the edge of the present into a future centered around an adorable dog-themed universe? JUMANJI is set to expand, and not at a snail's pace like a cactus. Picture viral trends, skyrocketing graphs, and those times you'll wish you had invested when the price was lower...


              </p>
              <p className="text0-[18px] text-[#22361B]">
                This project is designed to offer substantial long-term investment prospects for hodlers, as well as attractive profits for the astute day trader. In essence, don't let this opportunity slip by, like you did with the last one.
              </p>
              <div className="shiba-buy__btns">
                <a
                    className="shiba-buy__btn btn white-btn big"
                    href="/#about"
                    rel="noreferrer"
                >
                  Buy Now !
                </a>
                <a
                    className="shiba-buy__btn btn white-btn2 big"
                    href="https://t.me/jumanjicommunity"
                    target="_blank"
                    rel="noreferrer"
                >
                  Join us !
                </a>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
