import { useState, useEffect } from "react";

import dashboard from "../asserts/images/dashboard-1536x1334.png";

export default function Daashboard() {
  return (
    <section className="dashboard ">
      <div className="dashboard__wrapper flex justify-center">
        <h2 className="dashboard__title dashboard__title-mob section-title text-white">
          OUR AI DASHBOARD
        </h2>
        <div className="dashboard__container container">
          <div className="dashboard__wrap">
            <div className="dashboard__content">
              <h2 className="dashboard__title dashboard__title-desk section-title">
                OUR AI DASHBOARD
              </h2>
              <div className="dashboard__text">
                <p>
                  Shiba Memu is not your ordinary cryptocurrency token. It’s a
                  futuristic trailblazer, using AI technology to power its
                  revolutionary marketing capabilities. And at the heart of this
                  transformation is an ultra-innovative AI dashboard that’s
                  visible to all users.
                </p>
                <p>
                  This cutting-edge AI dashboard is more than just a window into
                  Shiba Memu’s marketing strategies, it’s a hub of real-time
                  updates, keeping you in the loop on all the hot and happening
                  marketing activities. From conversations with users in online
                  forums to sizzling social media discussions, you’ll get the
                  latest scoop on where Shiba Memu is making waves.
                </p>
                <p>
                  You’ll engage with the AI itself – asking questions, giving
                  feedback, and even sharing suggestions. No more feeling left
                  out of the crypto conversation or wondering what’s going on
                  behind the scenes.
                </p>
              </div>
              <div className="shmu-connect-button">
                <button className="css-pkdr5t">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__img move-element reveal">
          <img width="2036" height="1768" src={dashboard} alt="dashboard" />
        </div>
      </div>
    </section>
  );
}
