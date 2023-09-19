import { useState, useEffect } from "react";

import faqimg from "../asserts/images/shiba-rocket.svg";

export default function FAQ() {
  return (
    <section className="faqs" id="faqs">
      <div className="faqs__container">
        <div className="faqs__wrap">
          <div className="faqs_content">
            <h2 className="faqs__title section-title">FAQs</h2>
            <div
              className="faqs__slider"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">What is Shiba Memu?</p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      Shiba Memu is an ERC-20 token with a total supply of
                      1,000,000,000 tokens. The token was designed to be
                      community-owned, with 85% of the tokens sold in a presale
                      to ensure a strong and engaged community. The remaining
                      15% of the tokens will be distributed as follows:
                    </p>
                    <p>
                      10% of the tokens will be used to provide liquidity for
                      the token, fund exchange listings, and provide community
                      rewards. This will ensure that there is adequate liquidity
                      for the token and that it is widely available on different
                      exchanges. It will also provide incentives for users to
                      participate in the community and help promote the token.
                    </p>
                    <p>
                      The remaining 5% of the tokens will be held by the
                      development team to fund ongoing development and support
                      for the token. This will ensure that the token continues
                      to evolve and improve over time, providing added value to
                      users and investors.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">How does Shiba Memu use AI technology?</p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      Shiba Memu uses AI technology in various ways to optimize
                      its marketing efforts. The company leverages natural
                      language processing (NLP) and image/video recognition
                      technology to track its branding elements and monitor its
                      marketing initiatives across social media and online
                      communities.
                    </p>
                    <p>
                      Sentiment analysis helps the company determine the
                      positive or negative attitudes related to its token in
                      social media and online forums. Image and video
                      recognition technology identifies relevant discussions and
                      topics related to Shiba Memu, which can be transformed
                      into effective marketing campaigns. Predictive analytics
                      is used to predict future trends and market opportunities
                      that help the company adjust its marketing strategies
                      accordingly. Lastly, AI personalization is used to craft
                      customized marketing messages based on user behaviors and
                      preferences, increasing engagement and conversion rates.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">
                    How can I buy Shiba Memu tokens on exchange?
                  </p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      It is important to note that it is impossible to buy Shiba
                      Memu tokens on exchanges prior to tokens listing. It is
                      also impossible to buy Shiba Memu tokens anywhere except
                      the Shiba Memu website during the presale. Investors
                      should be cautious of anyone saying otherwise.
                    </p>
                    <p>
                      To buy Shiba Memu tokens once listed, you’ll need a
                      cryptocurrency wallet that supports ERC-20 tokens, or you
                      can use the exchange the token lists on (once it is on
                      CEXs). If you don’t have one, you need to sign up for a
                      cryptocurrency exchange that supports the buying and
                      selling of Shiba Memu tokens, deposit funds, and place an
                      order to buy at the current market price or set a limit
                      order to buy at a specific price once the funds are in
                      your exchange account.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">How can I earn Shiba Memu tokens?</p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      There are several ways you earn Shiba Memu tokens once the
                      tokens list on exchanges, including:
                    </p>
                    <ol>
                      <li>
                        Participating in the Shiba Memu presale: During the
                        presale, 85% of the total supply of Shiba Memu tokens
                        will be available for purchase at a discount. By
                        participating in the presale, you can obtain Shiba Memu
                        tokens at a lower price than they may be available for
                        on exchanges. The only place to buy Shiba Memu tokens
                        during the presale is on the Shiba Memu website.
                      </li>
                      <li>
                        Providing liquidity to the Shiba Memu pool: You can
                        provide liquidity to the Shiba Memu pool through a
                        decentralized exchange (DEX) . By doing so, you can earn
                        fees from transactions made on the exchange, as well as
                        receive a portion of the trading fees generated by the
                        pool.
                      </li>
                      <li>
                        Staking Shiba Memu tokens: Once you have obtained Shiba
                        Memu tokens, you can stake them in a staking pool or a
                        smart contract to earn additional rewards. Staking
                        involves locking up your tokens for a period of time,
                        during which you will earn a percentage of the total
                        tokens staked.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">
                    How will the Shiba Memu AI Dashboard work?
                  </p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      Shiba Memu AI Dashboard will be a tool that allows users
                      to interact with Shiba Memu’s AI technology in real-time
                      and monitor its marketing activities. It’ll provide users
                      with insights on how Shiba Memu promotes itself across
                      multiple platforms, including social media and online
                      forums.
                    </p>
                    <p>
                      Through the AI dashboard, users will ask questions,
                      provide feedback, and make suggestions regarding Shiba
                      Memu’s marketing strategy, which will create an
                      interactive environment for communication between users
                      and the company. Users will also be able to view real-time
                      updates on Shiba Memu’s marketing activities and track the
                      progress of the token in terms of exposure and adoption.
                    </p>
                    <p>
                      Overall, the Shiba Memu AI Dashboard’s goal is to build a
                      strong and engaged community around the token by providing
                      transparency and interaction with the company’s AI
                      technology. By keeping users informed and engaged, the
                      dashboard will enhance communication and foster a more
                      supportive community for the growth and success of the
                      project.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">
                    What kind of information can users get from the Shiba Memu
                    AI Dashboard?
                  </p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      Users will get real-time updates on Shiba Memu’s marketing
                      activities and the ability to track the progress of the
                      token in terms of exposure and adoption, and interact with
                      the AI to contribute their ideas and feedback on the
                      marketing strategy.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">
                    What is the distribution of Shiba Memu tokens?
                  </p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>
                      85% of the total supply of Shiba Memu tokens will be sold
                      in a presale to build a strong and engaged community. The
                      remaining 15% will be allocated to provide token
                      liquidity, fund exchange listings, reward community
                      members, and support ongoing development of the token.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="faq"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <div className="faq-head">
                  <p itemProp="name">
                    What is the total supply of Shiba Memu tokens?
                  </p>
                </div>
                <div
                  className="faq-content content"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    <p>The total supply of Shiba Memu tokens is 1 billion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="move-cat"
            className="faqs__image move-element"
            style={{ transform: "translate3d(-26.1667px, -572.2px, 0px)" }}
          >
            <img src={faqimg} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
