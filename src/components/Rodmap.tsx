import { useState, useEffect } from "react";

import Container from "./Containerr";

import roadmap from "../asserts/images/roadmap.svg";

import q12024 from "../asserts/images/q1-2024.svg";
import q12025 from "../asserts/images/q1-2025.svg";
import q32023 from "../asserts/images/q3-2023.svg";
import q42023 from "../asserts/images/q4-2023.svg";
import q22024 from "../asserts/images/q2-2024.svg";
import q32024 from "../asserts/images/q3-2024.svg";
import q42024 from "../asserts/images/q4-2024.svg";

export default function Roadmap() {
  return (
    <div className="bg-[#affff5] py-[100px] roadmap" id="roadmap">
      <Container className="roadmap__container">
        <div className="flex flex-col gap-[30px]">
          <h2 className="uppercase flex justify-center font-bold font-[Cocogoose] text-[54px]">
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
                <p>Launch of Shiba Memu Token</p>
                <ul>
                  <li>Launch of the Shiba Memu token on Ethereum blockchain</li>
                  <li>
                    Presale of 85% of the total token supply to the community
                  </li>
                  <li>
                    Initial liquidity provided for trading on a decentralized
                    exchange
                  </li>
                  <li>
                    Launch of staking program to encourage community
                    participation and engagement
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q3 2023</h3>
                <div className="icon">
                  <img src={q32023} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-2 reveal reveal-x-right">
              <div className="content">
                <p>Development of AI Marketing Dashboard</p>
                <ul>
                  <li>
                    Development of the AI marketing dashboard, visible to users
                  </li>
                  <li>
                    Integration of machine learning algorithms to analyze
                    successful marketing strategies
                  </li>
                  <li>
                    Implementation of real-time updates on marketing activities
                    and performance
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q4 2023</h3>
                <div className="icon">
                  <img src={q42023} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-3 reveal reveal-x-left">
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
            </div>
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
                    Shiba Memu
                  </li>
                  <li>
                    Development of additional marketing tools and materials
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q2 2024</h3>
                <div className="icon">
                  <img src={q22024} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-5 reveal reveal-x-left">
              <div className="content">
                <p>Listings on Major Exchanges</p>
                <ul>
                  <li>Listing of Shiba Memu on major centralized exchanges</li>
                  <li>
                    Increased liquidity and accessibility for users and
                    investors
                  </li>
                </ul>
              </div>
              <div className="title-icon">
                <h3 className="title">Q3 2024</h3>
                <div className="icon">
                  <img src={q32024} alt="" />
                </div>
              </div>
            </div>
            <div className="roadmap__item quarter-6 reveal reveal-x-right">
              <div className="content">
                <p>Integration with Decentralized Applications</p>
                <ul>
                  <li>
                    Integration of Shiba Memu into decentralized applications
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
                    Continued development and improvement of the Shiba Memu
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
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
