import coinMarket from "../asserts/images/coinmarket-1.svg";
import facebook from "../asserts/images/facebook-icon.svg";
import reddit from "../asserts/images/reddit-1.svg";
import linkedin from "../asserts/images/linktree-1.svg";
import discord from "../asserts/images/discord-icon.svg";
import telegram from "../asserts/images/telegram-icon.svg";
import instagram from "../asserts/images/instagram-1.svg";
import youtube from "../asserts/images/youtube-1.svg";
import twitter from "../asserts/images/twitter-icon.svg";
export default function Footer() {
  return (
    <footer className="footer dark-blue">
      <div className="footer__container">
        <div className="footer__wrap">
          <div className="footer__content">
            <div className="right">
              <div className="social__list"></div>
            </div>
            <div className="footer__privacy">
              <nav className="footer-nav">
                <ul id="menu-privacy-menu" className="menu-list">
                  <li
                    id="menu-item-185"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-185"
                  ></li>
                  <li
                    id="menu-item-187"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-187"
                  >
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      className="social__link"
                      rel="noreferrer"
                    >
                      <img
                        src={twitter}
                        alt="Twitter"
                        width="45"
                        height="45"
                        className="entered lazyloaded"
                      />
                    </a>
                  </li>
                  <li
                    id="menu-item-1840"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1840"
                  >
                    <a
                      href="https://t.me"
                      target="_blank"
                      className="social__link"
                      rel="noreferrer"
                    >
                      <img
                        src={telegram}
                        alt="Telegram"
                        width="45"
                        height="45"
                        className="entered lazyloaded"
                      />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <p className="footer__copyright">
            © 2023 LendBook Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
