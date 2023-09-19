import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../asserts/scss/swiper.scss";

// import required modules
import { Pagination } from "swiper/modules";

import benzinga from "../asserts/images/benzinga.svg";
import bloomberg from "../asserts/images/Bloomberg.svg";
import coinmarketcap from "../asserts/images/coinmarketcap.svg";
import cointelegraph from "../asserts/images/Cointelegraph.svg";
import invezz from "../asserts/images/invezz.svg";
import bitcoinist from "../asserts/images/Bitcoinist.png";
import beinCrypto from "../asserts/images/beinCrypto.png";
import yahoo from "../asserts/images/yahoo.svg";

import comCointelegraph from "../asserts/images/cointelegraph.png";
import amb from "../asserts/images/amb.png";

import Container from "./Containerr";

const imageList = [
  { key: 1, team: 1, image: bloomberg },
  { key: 2, team: 1, image: invezz },
  { key: 3, team: 1, image: cointelegraph },
  { key: 4, team: 1, image: bitcoinist },
  { key: 5, team: 2, image: coinmarketcap },
  { key: 6, team: 2, image: beinCrypto },
  { key: 7, team: 2, image: benzinga },
  { key: 8, team: 2, image: yahoo },
];

const companyList = [
  {
    key: 1,
    team: 1,
    image: comCointelegraph,
    text: "Shiba Memu is a fresh coin utilizing AI to promote itself. Their technology is poised to gain traction within the blockchain industry in the coming years, establishing Shiba Memu as an industry innovator...",
  },
  {
    key: 2,
    team: 2,
    image: amb,
    text: "With plenty of people inside and outside of crypto becoming more excited about the rich potential of AI, Shiba Memu could become the next leader in an industry already valued at almost $20 billion...",
  },
];

export default function Brand() {
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };
  return (
    <div className="bg-[#0c2349] py-[28px]">
      <Container>
        <div className="flex flex-col gap-[10px]">
          <div className="flex justify-center items-center">
            <h2 className="section-title !text-white">AS SEEN ON</h2>
          </div>

          <div className="sm:block hidden">
            <Swiper
              pagination={pagination}
              spaceBetween={30}
              modules={[Pagination]}
            >
              <SwiperSlide>
                <div className="sm:grid grid-cols-4 gap-4 hidden">
                  {imageList.map((img) => {
                    return (
                      <>
                        <div className="flex justify-center items-center">
                          <a
                            className="brands__item"
                            href="https://shibamemu.com/news/"
                            data-mobile="1"
                          >
                            <img
                              src={img.image}
                              alt={img.key.toString()}
                              decoding="async"
                            />
                          </a>
                        </div>
                      </>
                    );
                  })}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="sm:hidden block">
            <Swiper pagination={pagination} modules={[Pagination]}>
              <SwiperSlide>
                <div className="grid grid-cols-2 gap-4 sm:hidden">
                  {imageList
                    .filter((item) => item.team === 1)
                    .map((img) => {
                      return (
                        <>
                          <div className="flex justify-center items-center">
                            <a
                              className="brands__item"
                              href="https://shibamemu.com/news/"
                              data-mobile="1"
                            >
                              <img
                                src={img.image}
                                alt={img.key.toString()}
                                decoding="async"
                              />
                            </a>
                          </div>
                        </>
                      );
                    })}
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="grid grid-cols-2 gap-4 sm:hidden">
                  {imageList
                    .filter((item) => item.team === 2)
                    .map((img) => {
                      return (
                        <>
                          <div className="flex justify-center items-center">
                            <a
                              className="brands__item"
                              href="https://shibamemu.com/news/"
                              data-mobile="1"
                            >
                              <img
                                src={img.image}
                                alt={img.key.toString()}
                                decoding="async"
                              />
                            </a>
                          </div>
                        </>
                      );
                    })}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          {/* conpany list */}
          <div className="sm:block hidden">
            <Swiper
              pagination={pagination}
              spaceBetween={30}
              modules={[Pagination]}
            >
              <SwiperSlide>
                <div className="sm:grid grid-cols-2 gap-4 hidden ">
                  {companyList.map((com) => {
                    return (
                      <>
                        <div className="flex flex-col items-center companies-item">
                          <div className="max-h-[40px]">
                            <img
                              src={com.image}
                              alt={com.key.toString()}
                              decoding="async"
                            />
                          </div>
                          <p className="normal-case italic">{com.text}</p>
                        </div>
                      </>
                    );
                  })}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="sm:hidden block">
            <Swiper pagination={pagination} modules={[Pagination]}>
              {companyList.map((com) => {
                return (
                  <>
                    <SwiperSlide>
                      <div className="grid">
                        <div className="flex flex-col items-center companies-item">
                          <div className="max-h-[40px]">
                            <img
                              src={com.image}
                              alt={com.key.toString()}
                              decoding="async"
                            />
                          </div>
                          <p className="normal-case italic">{com.text}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                );
              })}
            </Swiper>
          </div>
        </div>
      </Container>
    </div>
  );
}
