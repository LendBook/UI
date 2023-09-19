import { useState, useEffect } from "react";

import Container from "./Containerr";
import tool1 from "../asserts/images/tool-1.png";
import tool2 from "../asserts/images/tool-2.png";
import tool3 from "../asserts/images/tool-3.png";
import tool4 from "../asserts/images/tool-4.png";
import tool5 from "../asserts/images/tool-5.png";

import about1 from "../asserts/images/about-1.png";
import about2 from "../asserts/images/about-2.png";

import team1 from "../asserts/images/team-1.svg";
import team2 from "../asserts/images/team-2.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../asserts/scss/swiper.scss";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";

const aboutUsStr =
  "Shiba Memu is a show off. It can do the work of 100 marketing agencies. Shiba Memu watches everything, all the time. When you’re sleeping Shiba Memu is working. All day, all night, finding the best work going on in creative advertising, eating it up and spitting it back out, but better.\n\nThis is a  completely new and revolutionary meme token. Its self-sufficient marketing capabilities, powered by AI technology, make it a unique and attractive investment.\n\nUnlike other meme tokens, which require significant marketing efforts from human teams to gain traction, Shiba Memu will create its own marketing strategies, write its own PR, and promote itself in relevant forums and social networks.\n\nShiba Memu is a warrior that cuts through the fluff. Why have teams of sleepy people writing parodies of each others’ work, when a kick ass dog robot meme genius can do it instead?\n\n";
const howItWorkStr =
  "Shiba Memu will generate more content than a tabloid newspaper vying for attention. Imagine gazillions of bites of data feeding into press releases and marketing materials. Content will be published all over forums and social media. It’ll also monitor and analyze the performance of its own marketing efforts, adjusting strategies to optimize results like a page out of the Art of War.\n\nShiba Memu’s AI technology lets it engage with users directly. There will be a robotastic dashboard to interact with the AI, provide feedback, make suggestions, and ask questions. Oh yes, you can talk to a robot meme dog marketing genius";

const ourToolsList = [
  {
    id: 1,
    image: tool2,
    title: "Sentiment Analysis",
    text: "By analyzing the sentiment of social media posts, forums, and other online communities related to Shiba Memu, AI can help identify positive or negative sentiment towards the token. Shiba Memu will suss the vibe and make sure everyone is happy.",
  },
  {
    id: 2,
    image: tool4,
    title: "Predictive Analytics",
    text: "By analyzing historical data and market trends, AI can help predict future market trends and user behavior. This can help Shiba Memu identify potential market opportunities and adjust its marketing strategies accordingly.",
  },
  {
    id: 3,
    image: tool5,
    title: "Personalization",
    text: "AI-personalized marketing messages based on user behavior, preferences, and other data – massively increasing engagement. You know when you speak to your friends about something then suddenly get an ad? Like they’re watching you? That’s Shiba Memu.\nErm..cough…Shiba Memu is right there. A fly on the wall. Yours and everyone else’s walls.",
  },
  {
    id: 4,
    image: tool1,
    title: "Natural Language Processing (NLP)",
    text: "AI-powered NLP algorithms will analyze social media posts, forums, and other online communities to identify relevant discussions and topics related to Shiba Memu. This information will be digested and turned into eye-catching marketing campaigns drawing in hungry investors.",
  },
  {
    id: 5,
    image: tool3,
    title: "Image and Video Recognition",
    text: "AI-powered image and video recognition technology will help identify and track Shiba Memu’s logo and other branding elements across social media platforms and other online communities, helping track its marketing efforts more effectively.",
  },
];

const teamMembers = [
  {
    image: team1,
    name: "Artem Chebotar",
    role: "Lead Developer",
    linkedin: "https://www.linkedin.com/in/artem-chebotar-6868a7174",
  },
  {
    image: team2,
    name: "Serhii Shurshyn",
    role: "Developer",
    linkedin: "http://www.linkedin.com/in/serhii-shurshin-a499a8234",
  },
];

export default function About() {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const [toolRow, setToolRow] = useState<number>(3);
  useEffect(() => {
    if (isMobile) setToolRow(1);
    else setToolRow(3);
  }, [isMobile]);
  return (
    <div className="bg-[#affff5] py-[28px]" id="about">
      <Container className="container">
        <div className="flex flex-col gap-[30px] ">
          <h2 className="about__title section-title">ABOUT US</h2>
          <div className="grid gap-4 sm:grid-cols-2 items-center mb-[60px]">
            <div className="flex justify-center">
              <img src={about1} alt="about-1" />
            </div>
            <div>
              <p className="text-[18px] whitespace-pre-wrap text-center sm:text-left font-[GothamPro-Regular]">
                {aboutUsStr}
              </p>
              <div className="flex justify-center sm:justify-start">
                <a
                  className="font-[24px] px-[40px] py-[19px] bg-[#0c2349] border-[2px] border-[#0c2349] text-white font-[GothamPro-Bold] rounded-[15px] no-underline hover:bg-white hover:text-black"
                  href="https://shibamemu.com/whitepaper.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Our Whitepaper
                </a>
              </div>
            </div>
          </div>

          {/* How it works */}

          <h2 className="about__title section-title">How It Works</h2>
          <div className="grid gap-4 sm:grid-cols-2 items-center mb-[60px]">
            <div>
              <p className="text-[18px] whitespace-pre-wrap text-center sm:text-right font-[GothamPro-Regular]">
                {howItWorkStr}
              </p>
              <div className="flex justify-center sm:justify-start shmu-connect-button ">
                <button className="text-white bg-[#FF7121] border-[#FF7121] px-[30px] py-[11px] font-bold rounded-[16px] buy-btn">
                  Buy Now
                </button>
              </div>
            </div>
            <div>
              <img src={about2} alt="about-2" />
            </div>
          </div>

          <h2 className="uppercase flex justify-center font-bold tools__title section-title">
            OUR TOOLS
          </h2>
          <div>
            <Swiper
              slidesPerView={toolRow}
              spaceBetween={30}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              loop={true}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {ourToolsList.map((com: any) => {
                return (
                  <>
                    <SwiperSlide>
                      <div className="tools-item">
                        <div className="tools-img h-[600px]">
                          <div className="flex justify-center items-center h-[250px]">
                            <img
                              src={com.image}
                              alt={com.id.toString()}
                              className="!w-[176px]"
                            />
                          </div>
                          <h3 className="tools-block-title block-title">
                            {com.title}
                          </h3>
                          <div className="tools-text">
                            <p>{com.text}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                );
              })}
            </Swiper>
          </div>

          <h2 className="uppercase flex justify-center font-bold team__title section-title">OUR TEAM</h2>
          <div className="flex gap-[30px] justify-center sm:flex-row flex-col">
            {teamMembers.map((mem) => {
              return (
                <div className="flex flex-col items-center">
                  <div>
                    <img src={mem.image} alt={mem.linkedin} />
                  </div>
                  <p className="team-name">{mem.name}</p>
                  <p className="team-position">{mem.role}</p>
                  <a
                    href={mem.linkedin}
                    target="_blank"
                    className="team-btn"
                    rel="noreferrer"
                  >
                    <svg
                      width="89"
                      height="23"
                      viewBox="0 0 89 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1138_5009)">
                        <path
                          d="M65.5767 1.64695C65.5767 0.736 66.3527 0 67.3081 0H87.2717C88.227 0 89.0031 0.739016 89.0031 1.64695V21.35C89.0031 22.261 88.227 22.997 87.2717 22.997H67.3081C66.3527 22.997 65.5767 22.258 65.5767 21.35V1.64695Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 19.2664H9.77621V16.1354H3.537V4.1875H0V19.2664Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.7262 19.2657V8.88026H11.1892V19.2657H14.7262ZM12.9577 7.46255C14.1914 7.46255 14.9581 6.66623 14.9581 5.6678C14.9365 4.64826 14.1914 3.87305 12.9794 3.87305C11.7674 3.87305 10.979 4.64826 10.979 5.6678C10.979 6.68734 11.7458 7.46255 12.933 7.46255H12.9547H12.9577Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16.3677 19.2665H19.9047V13.466C19.9047 13.1553 19.9263 12.8446 20.0222 12.6244C20.2788 12.006 20.86 11.3635 21.837 11.3635C23.117 11.3635 23.6303 12.3167 23.6303 13.7103V19.2665H27.1673V13.3121C27.1673 10.1208 25.4204 8.63672 23.0923 8.63672C21.1847 8.63672 20.3468 9.67737 19.8799 10.3862H19.9047V8.88105H16.3677C16.4141 9.85534 16.3677 19.2665 16.3677 19.2665Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32.1605 4.1875H28.6235V19.2664H32.1605V15.9002L33.0448 14.8143L35.815 19.2664H40.1682L35.512 12.8204L39.587 8.43458H35.3265C35.3265 8.43458 32.4171 12.3589 32.1605 12.8234V4.1875Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M49.6292 14.9348C49.6756 14.6694 49.7467 14.1566 49.7467 13.5774C49.7467 10.8928 48.3492 8.16602 44.6731 8.16602C40.7403 8.16602 38.9224 11.2005 38.9224 13.9545C38.9224 17.36 41.133 19.4865 44.9977 19.4865C46.5343 19.4865 47.9535 19.2663 49.1191 18.7988L48.6522 16.5184C47.6968 16.8261 46.7198 16.9829 45.5109 16.9829C43.8568 16.9829 42.4161 16.3223 42.2986 14.9107L49.6323 14.9318L49.6292 14.9348ZM42.2739 12.6001C42.3666 11.7133 42.9726 10.4072 44.4845 10.4072C46.0891 10.4072 46.4632 11.8038 46.4632 12.6001H42.2739Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M58.478 4.1875V9.40586H58.4317C57.9184 8.67589 56.8487 8.18724 55.4295 8.18724C52.7057 8.18724 50.3096 10.3138 50.3312 13.9455C50.3312 17.3118 52.4954 19.5047 55.1977 19.5047C56.6632 19.5047 58.0607 18.8834 58.7594 17.6889H58.8305L58.9696 19.2634H62.1109C62.0645 18.5335 62.0181 17.2696 62.0181 16.0299V4.1875H58.4811H58.478ZM58.478 14.4583C58.478 14.7238 58.4533 14.9892 58.4069 15.2124C58.1967 16.1656 57.3588 16.8292 56.3354 16.8292C54.8699 16.8292 53.9146 15.6769 53.9146 13.8611C53.9146 12.1568 54.7308 10.7813 56.3571 10.7813C57.4516 10.7813 58.2183 11.5113 58.4286 12.4192C58.475 12.6183 58.475 12.8415 58.475 13.0406V14.4583H58.478Z"
                          fill="white"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M72.6755 19.254V8.86854H69.1385V19.254H72.6755ZM70.907 7.45084C72.1406 7.45084 72.9073 6.65451 72.9073 5.65608C72.8857 4.63654 72.1406 3.86133 70.9286 3.86133C69.7166 3.86133 68.9282 4.63654 68.9282 5.65608C68.9282 6.67562 69.695 7.45084 70.8822 7.45084H70.9039H70.907Z"
                          fill="#FF7121"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M74.6357 19.2528H78.1727V13.4523C78.1727 13.1416 78.1944 12.8309 78.2902 12.6107C78.5468 11.9893 79.1281 11.3468 80.1051 11.3468C81.3851 11.3468 81.8983 12.3 81.8983 13.6966V19.2528H85.4353V13.2985C85.4353 10.1071 83.6885 8.62305 81.3604 8.62305C79.4527 8.62305 78.6149 9.6637 78.148 10.3726H78.1727V8.86737H74.6357C74.6821 9.84167 74.6357 19.2528 74.6357 19.2528Z"
                          fill="#FF7121"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_1138_5009">
                          <rect width="89" height="23" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
