import { useState, useEffect } from "react";

import shibaToBuy from "../asserts/images/shiba-today.svg";

export default function ShibaBuy() {
  return (
    <section className="shiba-buy dark-blue">
      <div className="shiba-buy__container">
        <div className="shiba-buy__wrap">
          <div className="shiba-buy__img">
            <img src={shibaToBuy} alt="shibaToBuy" />
          </div>
          <div className="shiba-buy__content">
            <h2 className="shiba-buy__title section-title !text-white">
              BUY SHIBA MEMU TODAY!
            </h2>
            <div className="shiba-buy__text">
              Shiba Memu offers benefits such as improved ROI, self-sufficiency,
              and transparency, using AI technology to deliver perfect marketing
              campaigns.
            </div>
            <div className="shiba-buy__btns">
              <a
                className="shiba-buy__btn btn white-btn big"
                href="https://shibamemu.com/whitepaper.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Our Whitepaper
              </a>
              <div className="shmu-connect-button">
                <button className="css-pkdr5t">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
