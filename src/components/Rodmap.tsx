import { useState, useEffect } from "react";

import Container from "./Containerr";

import roadmap from "../asserts/images/q3-2024.svg";

import q12024 from "../asserts/images/q1-2024.svg";
import q12025 from "../asserts/images/q1-2025.svg";
import q32023 from "../asserts/images/q3-2023.svg";
import q42023 from "../asserts/images/q4-2023.svg";
import q22024 from "../asserts/images/q2-2024.svg";
import q32024 from "../asserts/images/q3-2024.svg";
import q42024 from "../asserts/images/q4-2024.svg";

export default function Roadmap() {
  return (
    <div className="bg-[#22361B] py-[100px] roadmap" id="roadmap">
      <Container className="roadmap__container">
        <div className="flex flex-col gap-[30px] text-[#e8b67e]">
          <h2 className="uppercase flex justify-center font-bold font-[Cocogoose] text-[54px] text-[#e8b67e]">
            Roadmap
          </h2>
          <div className="roadmap__image reveal">
            <img src={roadmap} alt="roadmap" />
          </div>
        </div>
        <div className="roadmap-wrapper">
          <div className="roadmap__items">
            <div className="roadmap__item quarter-1 reveal reveal-x-left">
              <div className="content ">
                <p>Launch of JUMANJI Token</p>
                <ul>
                  <li>Launch of the JUMANJI project on Ethereum blockchain</li>
                  <li>
                    Presale phase open for the community
                  </li>
                  <li>
                    Prelisting on Coingecko, Coinmarketcap and CEX tier list 2/3
                  </li>
                  {/* <li>
                    Launch of staking program to encourage community
                    participation and engagement
                  </li> */}
                </ul>
              </div>
              <div className="title-icon text-[#e8b67e] ">
                <h3 className="title text-[#e8b67e]">Q1 2024</h3>
                <div className="icon ">
                  <img src={q32023} alt="" />
                </div>
              </div>
            </div>
            {/*<div className="roadmap__item quarter-3 reveal reveal-x-left">
              <div className="content">
                <p>Launch of AI Marketing Dashboard</p>
                <ul>
                  <li>Launch of the AI marketing dashboard to the community</li>
                  <li>
                    Implementation of user engagement features, including
                    suggestions and feedback
                  </li>
                  <li>
                    Integration of social media platforms and forums for
                    marketing activities
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q1 2024</h3>
                <div className="icon">
                  <img src={q12024} alt="" />
                </div>
              </div>
            </div>*/}
            <div className="roadmap__item quarter-4 reveal reveal-x-right">
              <div className="content">
                <p>Expansion of Marketing Efforts</p>
                <ul>
                  <li>
                    Expansion of marketing efforts to new markets and
                    communities
                  </li>
                  <li>
                    Partnership with influencers and content creators to promote
                    JUMANJI
                  </li>
                  <li>
                    Develop new futuristic website
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title ">Q2 2024</h3>
                <div className="icon">
                  <img src={q22024} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-2 reveal reveal-x-right">
              <div className="content">
                <p>Development of Jumanji application</p>
                <ul>
                  <li>
                    Version of the metaverse world of Jumanji in the browser
                  </li>
                  <li>
                    Mobile version compatible with famous wallet web3
                  </li>
                  <li>
                    NFT marketplace to buy/sell items on the Jumanji world with $JUM token
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q3-Q4 2024</h3>
                <div className="icon">
                  <img src={q42023} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-5 reveal reveal-x-left">
              <div className="content">
                <p>Listings on Major Exchanges</p>
                <ul>
                  <li>Listing of JUMANJI on major centralized exchanges</li>
                  <li>
                    Increased liquidity and accessibility for users and
                    investors
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q1 2025</h3>
                <div className="icon">
                  <img src={q32024} alt="" />
                </div>
              </div>
            </div>
           {/* <div className="roadmap__item quarter-6 reveal reveal-x-right">
              <div className="content">
                <p>Integration with Decentralized Applications</p>
                <ul>
                  <li>
                    Integration of JUMANJI into decentralized applications
                    and platforms
                  </li>
                  <li>Increased adoption and utility for the token</li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q4 2024</h3>
                <div className="icon">
                  <img src={q42024} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-7 reveal reveal-x-left">
              <div className="content">
                <p>Continued Development and Growth</p>
                <ul>
                  <li>
                    Continued development and improvement of the JUMANJI
                    token and its AI technology
                  </li>
                  <li>Expansion into new markets and applications</li>
                  <li>Increased community participation and engagement</li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q1 2025</h3>
                <div className="icon">
                  <img src={q12025} alt="" />
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </Container>
    </div>
  );
}
