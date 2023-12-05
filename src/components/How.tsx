import { useState, useEffect } from "react";

import buy1 from "../asserts/images/buy_1.svg";
import buy2 from "../asserts/images/buy_2.svg";
import buy3 from "../asserts/images/buy_3.svg";
import buy4 from "../asserts/images/buy_4-1.svg";
import buy5 from "../asserts/images/buy_5.svg";
import buy6 from "../asserts/images/buy_6.svg";
import buy7 from "../asserts/images/buy_7.svg";
import buy8 from "../asserts/images/claim.svg";

export default function How() {
  return (
    <section className="how bg-[#e8b67e]" id="how-to-buy">
      <div className="how__container">
        <div className="how__wrap">
          <h2 className="how__title section-title">How to Buy JUMANJI</h2>
          {/* <div className="how__info">
            <p>
              To buy and store JUMANJI tokens, you must have a top-rated,
              secured wallet that can connect to the Ethereum network.
            </p>
            <p>
              If you are buying JMW on your smartphone, we recommend using
              Trust Wallet as it has a simple interface that is easy to
              navigate, secure and offers direct access to decentralized
              exchanges like Uniswap. If you are buying JMW on your desktop, we
              recommend using MetaMask.
            </p>
          </div> */}
          <div className="how__list">
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">1.</p>
                <div className="how__image">
                  <img
                    src={buy1}
                    className="attachment-full size-full entered lazyloaded"
                    alt=""
                  />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">
                  Connect Your Wallet
                </h3>
                {/* <div className="how__text">
                  <p>
                    Here’s a snapshot overview of how to set up Trust Wallet on
                    your phone so that you can safely buy and store JUMANJI
                    tokens.
                  </p>
                </div> */}
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <p className="steps__subtitle">
                          Download Official Trust Wallet App
                        </p>
                        <div className="steps__text">
                          <p>
                            Trust Wallet is a mobile wallet app backed by the
                            Binance exchange. You can obtain the app via
                            <a
                              href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&amp;hl=en&amp;gl=US"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Play Store
                            </a>
                            and
                            <a
                              href="https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409"
                              target="_blank"
                              rel="noreferrer"
                            >
                              App Store
                            </a>
                            – or access the download link on the Binance
                            website.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <p className="steps__subtitle">Create Wallet</p>
                        <div className="steps__text">
                          <p>
                            You will now be asked if you already have a
                            <a
                              href="https://trustwallet.com/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Trust Wallet
                            </a>
                            or if you wish to create a new one. Click the
                            ‘Create a Wallet’ button to create a new one.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <p className="steps__subtitle">Backup Passphrase</p>
                        <div className="steps__text">
                          <p>
                            Carefully note down your 12-word backup passphrase.
                            Next, you must manually type the 12 words in the
                            correct sequence so that Trust Wallet knows you have
                            recorded the backup passphrase correctly. If your
                            phone is lost or stolen, the only way for you to
                            regain access to your Trust Wallet funds will be by
                            entering this backup passphrase.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <p className="steps__subtitle">Add JUMANJI Token</p>
                        <div className="steps__text">
                          <p>
                            Now that Trust Wallet is set up on your mobile
                            device, you can add JUMANJI tokens. Do this by
                            clicking the “+” icon on top-right of the screen,
                            followed by ‘Add Custom Token’ at the very bottom of
                            the list. Your network will be selected as
                            ‘Ethereum’ by default.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <p className="steps__subtitle">
                          Paste JUMANJI Contract Address
                        </p>
                        <div className="steps__text">
                          <p>
                            Paste JUMANJI Contract Address: Paste your JUM
                            token contract address found on your JUMANJI
                            deposit page so that the Trust Wallet can locate
                            your account. Double-check the contract address
                            pasted. We recommend verifying your JMW contract
                            address using the official JUMANJI Telegram
                            group.
                          </p>
                          <p>
                            The blank fields will now populate with the correct
                            contract specifics for JUMANJI – such as the
                            name, symbol, and number of decimals.
                          </p>
                          <p>
                            That’s it. You have now successfully set up a Trust
                            Wallet. You can connect your Trust Wallet directly
                            to Uniswap and buy/store your JUMANJI tokens
                            through a single app.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button className="how__btn btn big" type="button">
                  Read More
                </button> */}
              </div>
            </div>
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">2.</p>
                <div className="how__image">
                  <img
                    src={buy2}
                    className="attachment-full size-full entered lazyloaded"
                    alt=""
                  />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">
                  BUY WITH ETH/BNB or USDT
                </h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <p className="steps__subtitle">
                          Installing MetaMask Wallet on your browser
                        </p>
                        <div className="steps__text">
                          <p>
                            MetaMask is available in two forms – a mobile app
                            and a web browser extension. This guide explains the
                            detailed setup process when using MetaMask via a
                            browser extension. However, the process is similar
                            to the setup process of MetaMask app on IOS or
                            Android smartphones.
                          </p>
                          <p>
                            The first step is to visit the MetaMask website and
                            choose the browser on that you wish to install the
                            wallet. The most common options are Chrome and
                            Firefox.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <p className="steps__subtitle">Create Wallet</p>
                        <div className="steps__text">
                          <p>
                            Once installed, click the ‘Create a Wallet’ button.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <p className="steps__subtitle">Create Password</p>
                        <div className="steps__text">
                          <p>
                            You will now be asked to create a password. Make
                            sure your password is complex and alphanumeric.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <p className="steps__subtitle">
                          Keep a Record of the Recovery Phrase
                        </p>
                        <div className="steps__text">
                          <p>
                            Next, you will be shown a recovery phrase that
                            consists of 12 words. Write these 12 words down on a
                            piece of paper and secure it in a safe place. If you
                            or anyone enters these 12 words into MetaMask
                            remotely, they will be able to access your wallet.
                            So you must never share your 12-word MetaMask
                            recovery phrase with anyone.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <p className="steps__subtitle">
                          Connect to Ethereum Network
                        </p>
                        <div className="steps__text">
                          <p>
                            By default, MetaMask only allows you to transact
                            with the Ethereum network. So there is no need to
                            change the network within MetaMask to engage with
                            the JUMANJI token.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 6</p>
                        <p className="steps__subtitle">
                          Import JUMANJI Token
                        </p>
                        <div className="steps__text">
                          <p>
                            You will now need to import JUM to your MetaMask
                            wallet. You can do this by clicking on ‘Import
                            Tokens’ and submitting the JUMANJI contract
                            address when announced. We recommend verifying the
                            JUM contract address using the official JUMANJI
                            Telegram group.
                          </p>
                          <p>
                            Once the token import process is completed, you can
                            view the tokens on your MetaMask wallet that you
                            bought during the pre-sale or via Uniswap.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button className="how__btn btn big" type="button">
                  Read More
                </button> */}
              </div>
            </div>
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">3.</p>
                <div className="how__image">
                  <img
                    src={buy3}
                    className="attachment-full size-full entered lazyloaded"
                    alt=""
                  />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">CLAIM YOUR TOKEN</h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <div className="steps__text">
                          <p>
                            First, ensure your wallet is connected to the Shiba
                            Memu and then click BUY WITH ETH.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <div className="steps__text">
                          <p>
                            You will now be directed to the exchange window,
                            where you input how much JMW you wish to buy. Below
                            is the amount of ETH you will be ‘Selling’ to carry
                            out the purchase. Once you have input your ‘Buying’
                            amount, CONVERT ETH
                          </p>
                          <p>
                            <strong>Please note:</strong> the minimum purchase
                            amount is 1000 JMW.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <div className="steps__text">
                          <p>
                            You will now need to confirm your purchase. Once you
                            are happy with the transaction details, click
                            ‘Confirm’.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <div className="steps__text">
                          <p>
                            You have now completed your purchase. Please allow a
                            few moments for the transaction to complete.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <div className="steps__text">
                          <p>
                            On successful completion of your purchase, you will
                            be able to navigate to view your transaction on the
                            blockchain, START AGAIN to carry out another
                            purchase, or FINISH.
                          </p>
                          <p>
                            Your JMW tokens will be available to claim once the
                            JUMANJI presale period ends.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button className="how__btn btn big" type="button">
                  Read More
                </button> */}
              </div>
            </div>
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">4.</p>
                <div className="how__image">
                  <img src={buy4} alt="" />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">
                  JOIN THE JUMANJI WORLD
                </h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <div className="steps__text">
                          <p>
                            To purchase the JUMANJI token with USDT you must
                            have at least $30 USDT in your wallet to make the
                            transaction. First, ensure your wallet is connected
                            to the JUMANJI exchange and then click BUY WITH
                            USDT.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <div className="steps__text">
                          <p>
                            You will now be directed to the exchange window,
                            where you input how much D2T you wish to buy. Below
                            is the amount of USDT you will be ‘Selling’ to carry
                            out the purchase. Once you have input your ‘Buying’
                            amount, CONVERT USDT.
                          </p>
                          <p>
                            Please note: the minimum purchase amount is 1000
                            JMW.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <div className="steps__text">
                          <p>
                            You will now need to confirm your purchase. You will
                            be asked to approve the purchase twice. The first
                            approval is for the USDT contract; click ‘Confirm’
                            to move through to the second confirmation window.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <div className="steps__text">
                          <p>
                            The second approval is for the transaction amount.
                            Here the gas fee for the transaction will be shown.
                            A gas fee is paid to network validators for their
                            services to the blockchain to carry out
                            transactions.
                          </p>
                          <p>
                            Please make sure you go through two approval steps
                            to complete the transaction.
                          </p>
                        </div>
                      </div>
                      {/*<div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <div className="steps__text">
                          <p>
                            You have now completed your purchase. Please allow a
                            few moments for the transaction to complete.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 6</p>
                        <div className="steps__text">
                          <p>
                            On successful completion of your purchase, you will
                            be able to navigate to view your transaction on the
                            blockchain, START AGAIN to carry out another
                            purchase, or FINISH.
                          </p>
                          <p>
                            Your JMW tokens will be available to claim once the
                            JUMANJI JumanjiPresale.sol period ends.
                          </p>
                        </div>
                      </div>*/}
                    </div>
                  </div>
                </div>
               {/* <button className="how__btn btn big" type="button">
                  Read More
                </button>*/}
              </div>
            </div>
           {/* <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">5.</p>
                <div className="how__image">
                  <img src={buy5} alt="" />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">How to Buy with BNB</h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <div className="steps__text">
                          <p>
                            First, ensure your wallet is connected to the Shiba
                            Memu exchange, click CONNECT WALLET in the top right
                            corner of the screen or in the burger menu if on
                            mobile. Here you will be given the option to connect
                            with one of the supported wallets. As previously
                            mentioned, if purchasing through mobile, we
                            recommend Trust Wallet, and on desktop through
                            MetaMask.
                          </p>
                          <p>Click BUY JMW WITH BNB.</p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <div className="steps__text">
                          <p>
                            You will now be directed to the exchange window,
                            where you can input how much JMW you wish to buy.
                            Below is the amount of BNB you will be paying to
                            carry out the purchase. Once you have input your
                            JMW amount, BUY NOW.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <div className="steps__text">
                          <p>
                            You will now need to confirm your purchase. Your
                            wallet will automatically bring up the confirmation
                            window where you can view the details and gas fee
                            for the transaction.
                          </p>
                          <p>
                            Please ensure you have enough BNB inside your wallet
                            to cover the purchase and the gas fee. A gas fee is
                            paid to network validators for their services to the
                            blockchain to carry out transactions.
                          </p>
                          <p>
                            Once you are happy with the transaction details,
                            click ‘Confirm’ inside your wallet.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <div className="steps__text">
                          <p>
                            You have now completed your purchase. Please allow a
                            few moments for the transaction to complete.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <div className="steps__text">
                          <p>
                            On successful completion of your purchase, you will
                            be able to navigate to view your ‘Transaction on
                            Bscscan’.
                          </p>
                          <p>
                            Your JMW tokens will be available to claim once the
                            JUMANJI JumanjiPresale.sol period ends.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="how__btn btn big" type="button">
                  Read More
                </button>
              </div>
            </div>
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">6.</p>
                <div className="how__image">
                  <img src={buy6} alt="" />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">
                  How to Buy with BUSD
                </h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <div className="steps__text">
                          <p>
                            First, ensure your wallet is connected to the Shiba
                            Memu exchange, click CONNECT WALLET in the top right
                            corner of the screen or in the burger menu if on
                            mobile. Here you will be given the option to connect
                            with one of the supported wallets. As previously
                            mentioned, if purchasing through mobile, we
                            recommend Trust Wallet, and on desktop through
                            MetaMask.
                          </p>
                          <p>Click BUY JMW WITH BUSD.</p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <div className="steps__text">
                          <p>
                            You will now be directed to the exchange window,
                            where you can input how much JMW you wish to buy.
                            You will first have to enter the amount of BUSD you
                            wish to APPROVE with the JumanjiPresale.sol contract. You will
                            be asked to confirm this inside your wallet.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <div className="steps__text">
                          <p>
                            Once approved you can enter the amount of JMW you
                            wish to buy. Your BUSD will not be approved if the
                            approval amount is less than the purchase amount.
                            Once approved, BUY NOW to finalise your transaction.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <div className="steps__text">
                          <p>
                            You will now need to confirm your purchase. Your
                            wallet will automatically bring up the confirmation
                            window where you can view the details and gas fee
                            for the transaction.
                          </p>
                          <p>
                            Please ensure you have enough BNB inside your wallet
                            to cover the purchase and the gas fee. A gas fee is
                            paid to network validators for their services to the
                            blockchain to carry out transactions.
                          </p>
                          <p>
                            Once you are happy with the transaction details,
                            click ‘Confirm’ inside your wallet.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 5</p>
                        <div className="steps__text">
                          <p>
                            You have now completed your purchase. Please allow a
                            few moments for the transaction to complete.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 6</p>
                        <div className="steps__text">
                          <p>
                            On successful completion of your purchase, you will
                            be able to navigate to view your ‘Transaction on
                            Bscscan’.
                          </p>
                          <p>
                            Your JMW tokens will be available to claim once the
                            JUMANJI JumanjiPresale.sol period ends.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="how__btn btn big" type="button">
                  Read More
                </button>
              </div>
            </div>
            <div className="how__item">
              <div className="how__wrapper">
                <p className="how__count">7.</p>
                <div className="how__image">
                  <img src={buy7} alt="" />
                </div>
              </div>
              <div className="how__content">
                <h3 className="how__head section-title">
                  How to Buy ETH/BNB with Card
                </h3>
                <div className="steps">
                  <div className="steps__wrap">
                    <div className="steps__list">
                      <div className="steps__item">
                        <p className="steps__title">Step 1</p>
                        <div className="steps__text">
                          <p>
                            To buy JMW with BNB or BUSD you will need to have
                            enough BNB in your wallet to make a purchase and
                            cover small gas fees. To top your wallet up with
                            BNB, connect your wallet and head to BUY JMW WITH
                            BNB, click BUY IT HERE.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 2</p>
                        <div className="steps__text">
                          <p>
                            You will then be directed to our on-ramping partner,
                            Transak, where you can buy BNB using your card, via
                            bank transfer or other methods, such as Apple pay,
                            directly in the widget.
                          </p>
                          <p>
                            Select your chosen currency, enter the amount you
                            wish to pay, and then choose your payment method.
                            Outlined below are the estimated BNB you will
                            receive, the rate and the total fees to carry out
                            the transaction.
                          </p>
                          <p>
                            Once you have chosen your payment method and
                            purchase amount, click BUY NOW.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 3</p>
                        <div className="steps__text">
                          <p>
                            Before completing your purchase, you will have to go
                            through Transak’s Know your customer (KYC) process
                            to verify your account for purchasing. KYC is the
                            practice carried out by companies to verify the
                            identity of their clients in compliance with legal
                            requirements and current laws and regulations. But
                            don’t worry, it only takes a few minutes.
                          </p>
                        </div>
                      </div>
                      <div className="steps__item">
                        <p className="steps__title">Step 4</p>
                        <div className="steps__text">
                          <p>
                            Once you have carried out Transak’s KYC process you
                            are all done! Once payment has been authorized, it
                            will take a few minutes for your order to be
                            processed. Transak will send you a confirmation
                            email once your BNB has been delivered to your
                            wallet. Here you can also track your order or
                            navigate back to the app.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="how__btn btn big" type="button">
                  Read More
                </button>
              </div>
            </div>*/}
          </div>
          {/*<div className="claim">
            <div className="claim__img">
              <img src={buy8} alt="" />
            </div>
            <h3 className="claim__head section-title">
              How to Claim JUMANJI
            </h3>
            <div className="claim__info how__info">
              <p>
                You can claim your JMW tokens at the end of the JumanjiPresale.sol.
                Details will be released closer to the time. Once the JumanjiPresale.sol
                period has concluded, you must visit the main site and click the
                “Claim” button. Take extreme care to ensure you’re claiming on
                the official site as it is impossible to claim elsewhere.
              </p>
            </div>
          </div>*/}
        </div>
      </div>
    </section>
  );
}
