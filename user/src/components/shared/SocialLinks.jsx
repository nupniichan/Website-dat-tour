import styled from "styled-components";

export const GithubLink = () => {
    return (
        <GithubStyledWrapper>
            <button className="Btn">
                <span className="svgContainer">
                    <svg fill="white" viewBox="0 0 496 512" height="1.6em">
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                    </svg>
                </span>
                <span className="BG" />
            </button>
        </GithubStyledWrapper>
    );
};

const GithubStyledWrapper = styled.div`
    .Btn {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        position: relative;
        /* overflow: hidden; */
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .svgContainer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        backdrop-filter: blur(0px);
        letter-spacing: 0.8px;
        border-radius: 10px;
        transition: all 0.3s;
        border: 1px solid rgba(156, 156, 156, 0.466);
        z-index: 2;
    }

    .BG {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background: #181818;
        z-index: 1;
        border-radius: 10px;
        pointer-events: none;
        transition: all 0.3s;
    }

    .Btn:hover .BG {
        transform: rotate(35deg);
        transform-origin: bottom;
    }

    .Btn:hover .svgContainer {
        background-color: rgba(156, 156, 156, 0.466);
        backdrop-filter: blur(4px);
    }
`;

export const InstaLink = () => {
    return (
        <InstaStyledWrapper>
            <button className="Btn">
                <span className="svgContainer">
                    <svg
                        fill="white"
                        className="svgIcon"
                        viewBox="0 0 448 512"
                        height="1.5em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                </span>
                <span className="BG" />
            </button>
        </InstaStyledWrapper>
    );
};

const InstaStyledWrapper = styled.div`
    .Btn {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        position: relative;
        /* overflow: hidden; */
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .svgContainer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        backdrop-filter: blur(4px);
        letter-spacing: 0.8px;
        border-radius: 10px;
        transition: all 0.3s;
        border: 1px solid rgba(156, 156, 156, 0.466);
        z-index: 2;
    }

    .BG {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background: #f09433;
        background: -moz-linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 25%,
            #dc2743 50%,
            #cc2366 75%,
            #bc1888 100%
        );
        background: -webkit-linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 25%,
            #dc2743 50%,
            #cc2366 75%,
            #bc1888 100%
        );
        background: linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 25%,
            #dc2743 50%,
            #cc2366 75%,
            #bc1888 100%
        );
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
        z-index: 1;
        border-radius: 9px;
        pointer-events: none;
        transition: all 0.3s;
    }

    .Btn:hover .BG {
        transform: rotate(35deg);
        transform-origin: bottom;
    }

    .Btn:hover .svgContainer {
        background-color: rgba(156, 156, 156, 0.466);
    }
`;

export const TwitterLink = () => {
    return (
        <TwitterStyledWrapper>
            <button className="Btn">
                <span className="svgContainer">
                    <svg
                        viewBox="-0 -2 20 20"
                        height="1.4rem"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#fff"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <title>twitter [#154]</title>{" "}
                            <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                            <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                            >
                                {" "}
                                <g
                                    id="Dribbble-Light-Preview"
                                    transform="translate(-60.000000, -7521.000000)"
                                    fill="#fff"
                                >
                                    {" "}
                                    <g
                                        id="icons"
                                        transform="translate(56.000000, 160.000000)"
                                    >
                                        {" "}
                                        <path
                                            d="M10.29,7377 C17.837,7377 21.965,7370.84365 21.965,7365.50546 C21.965,7365.33021 21.965,7365.15595 21.953,7364.98267 C22.756,7364.41163 23.449,7363.70276 24,7362.8915 C23.252,7363.21837 22.457,7363.433 21.644,7363.52751 C22.5,7363.02244 23.141,7362.2289 23.448,7361.2926 C22.642,7361.76321 21.761,7362.095 20.842,7362.27321 C19.288,7360.64674 16.689,7360.56798 15.036,7362.09796 C13.971,7363.08447 13.518,7364.55538 13.849,7365.95835 C10.55,7365.79492 7.476,7364.261 5.392,7361.73762 C4.303,7363.58363 4.86,7365.94457 6.663,7367.12996 C6.01,7367.11125 5.371,7366.93797 4.8,7366.62489 L4.8,7366.67608 C4.801,7368.5989 6.178,7370.2549 8.092,7370.63591 C7.488,7370.79836 6.854,7370.82199 6.24,7370.70483 C6.777,7372.35099 8.318,7373.47829 10.073,7373.51078 C8.62,7374.63513 6.825,7375.24554 4.977,7375.24358 C4.651,7375.24259 4.325,7375.22388 4,7375.18549 C5.877,7376.37088 8.06,7377 10.29,7376.99705"
                                            id="twitter-[#154]"
                                        >
                                            {" "}
                                        </path>{" "}
                                    </g>{" "}
                                </g>{" "}
                            </g>{" "}
                        </g>
                    </svg>
                </span>
                <span className="BG" />
            </button>
        </TwitterStyledWrapper>
    );
};

const TwitterStyledWrapper = styled.div`
    .Btn {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        position: relative;
        /* overflow: hidden; */
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .svgContainer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        backdrop-filter: blur(0px);
        letter-spacing: 0.8px;
        border-radius: 10px;
        transition: all 0.3s;
        border: 1px solid rgba(156, 156, 156, 0.466);
        z-index: 2;
    }

    .BG {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background: #1da0f1;
        z-index: 1;
        border-radius: 10px;
        pointer-events: none;
        transition: all 0.3s;
    }

    .Btn:hover .BG {
        transform: rotate(35deg);
        transform-origin: bottom;
    }

    .Btn:hover .svgContainer {
        background-color: rgba(156, 156, 156, 0.466);
        backdrop-filter: blur(4px);
    }
`;

export const FacebookLink = () => {
    return (
        <FacebookStyledWrapper>
            <button className="Btn">
                <span className="svgContainer">
                    <svg
                        fill="#fff"
                        viewBox="00 00 1920 1920"
                        height="1.4em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M1168.737 487.897c44.672-41.401 113.824-36.889 118.9-36.663l289.354-.113 6.317-417.504L1539.65 22.9C1511.675 16.02 1426.053 0 1237.324 0 901.268 0 675.425 235.206 675.425 585.137v93.97H337v451.234h338.425V1920h451.234v-789.66h356.7l62.045-451.233H1126.66v-69.152c0-54.937 14.214-96.112 42.078-122.058"
                                fillRule="evenodd"
                            ></path>
                        </g>
                    </svg>
                </span>
                <span className="BG" />
            </button>
        </FacebookStyledWrapper>
    );
};

const FacebookStyledWrapper = styled.div`
    .Btn {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        position: relative;
        /* overflow: hidden; */
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .svgContainer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        backdrop-filter: blur(0px);
        letter-spacing: 0.8px;
        border-radius: 10px;
        transition: all 0.3s;
        border: 1px solid rgba(156, 156, 156, 0.466);
        z-index: 2;
    }

    .BG {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        background: #0865fe;
        z-index: 1;
        border-radius: 10px;
        pointer-events: none;
        transition: all 0.3s;
    }

    .Btn:hover .BG {
        transform: rotate(35deg);
        transform-origin: bottom;
    }

    .Btn:hover .svgContainer {
        background-color: rgba(156, 156, 156, 0.466);
        backdrop-filter: blur(4px);
    }
`;
