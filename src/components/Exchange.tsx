import { useState, useEffect } from "react";

import Container from "./Containerr";

import incoming from "../asserts/images/Shiba-incoming.webp";
import bitmart from "../asserts/images/bitmart.svg";

export default function Exchange() {
  return (
    <section className="exchange">
      <div className="exchange__container">
        <h2 className="exchange__title section-title">
          Exchange &amp; Partnerships
        </h2>
        <div className="exchange__wrap">
          <div className="exchange__img">
            <img width="695" height="845" alt="" src={incoming} />
          </div>
          <div className="exchange__list">
            <div className="exchange__item">
              <img
                className="attachment-full size-full entered lazyloaded"
                alt=""
                src={bitmart}
              />
            </div>
            <div className="exchange__item">
              <div className="coming-soon-animate">
                <div className="loader-animate" aria-label="Loader"></div>
                <p>Coming soon</p>
              </div>
            </div>
            <div className="exchange__item">
              <div className="coming-soon-animate">
                <div className="loader-animate" aria-label="Loader"></div>
                <p>Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
