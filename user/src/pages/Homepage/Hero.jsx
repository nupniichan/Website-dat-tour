import { DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation.jsx";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect.jsx";
import cities from "../../json/cities.json";
import PagesNames from "../../Router/PagesNames.js";

const Hero = () => {
    const [filteredCities, setFilteredCities] = useState(cities);
    const [selectedCity, setSelectedCity] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const navigate = useNavigate();

    const disablePastDates = (current) => {
        return current && current < dayjs().startOf("day");
    };

    const onCityChange = (value) => {
        setSelectedCity(value);
    };

    const onSearch = (value) => {
        const filtered = value
            ? cities.filter((city) =>
                  city.city.toLowerCase().includes(value.toLowerCase())
              )
            : cities;
        setFilteredCities(filtered);
    };

    const onDateChange = (date, dateString) => {
        setDepartureDate(dateString);
    };

    const handleSearch = async () => {
        if (!selectedCity) {
            message.error({
                content: 'Vui lòng chọn điểm đến.',
            })
            return;
        }

        if (!departureDate) {
            message.error({
                content: 'Vui lòng chọn ngày khởi hành.',
            })
            return;
        }

        const formattedDate = dayjs(departureDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
        );
        const apiUrl = `http://localhost:5000/search/tour-with-date?q=${selectedCity}&date=${formattedDate}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Lỗi mạng.");
            }

            const data = await response.json();
            navigate(
                `${PagesNames.SEARCH_RESULTS}?city=${encodeURIComponent(
                    selectedCity
                )}&date=${formattedDate}`,
                { state: { results: data } }
            );
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    const heroSLogan = `Your dream vacation, tailored to perfection`;

    return (
        <div id="hero-container" className="h-[106vh] relative">
            {/* <section className="relative"> */}
            <BackgroundGradientAnimation />

            {/* Hero Items */}
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                <div className="home-search space-y-5 xl:max-w-xl md:max-w-lg max-w-md mx-auto text-center 2xl:mt-40 xl:mt-28 lg:mt-14 md:-mt-3 -mt-7 no-select">
                    <TextGenerateEffect
                        duration={3.5}
                        filter={true}
                        words={heroSLogan}
                    />

                    <div className="search-form top-full left-1/2 transform -translate-x-1/2 xl:-translate-y-[5rem] lg:-translate-y-[7rem] md:-translate-y-[6rem] -translate-y-[8.4rem] absolute z-30 font-normal xl:w-[800px] lg:w-[700px] md:w-[700px] sm:w-[700px] bg-white border border-[rgba(239,82,34,0.6)] rounded-xl p-6 outline outline-8 outline-[rgba(170,46,8,0.1)] xl:scale-100 lg:scale-90 md:scale-75 sm:scale-[60%]">
                        <div className="grid grid-cols-2 py-2 -translate-y-1">
                            <div className="mr-4 flex flex-1 flex-col">
                                <label className="text-left mb-1 text-sm">
                                    Điểm đến
                                </label>
                                <Select
                                    showSearch
                                    placeholder="Nhập điểm đi"
                                    onChange={onCityChange}
                                    onSearch={onSearch}
                                    filterOption={false}
                                    style={{
                                        textAlign: "left",
                                        height: "4rem",
                                    }}
                                >
                                    {filteredCities.map((city, index) => (
                                        <Select.Option
                                            key={index}
                                            value={city.city}
                                        >
                                            {city.city}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="mr-4 flex flex-1 flex-col">
                                <label className="text-left mb-1 text-sm">
                                    Ngày khởi hành
                                </label>
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    size="large"
                                    placeholder="Chọn ngày"
                                    disabledDate={disablePastDates}
                                    onChange={onDateChange}
                                    style={{ height: "4rem" }}
                                />
                            </div>
                        </div>

                        <div className="search-btn relative flex w-full justify-center">
                            <Button
                                text='Tìm Kiếm'
                                onClick={handleSearch}
                                className="absolute z-10 -translate-x-[5.5rem] hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div
                className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
                style={
                    {
                        // background:
                        //     "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(217, 181, 61, 0.26) 56.49%, rgba(244, 109, 42, 0.4) 115.91%)",
                    }
                }
            >
            </div> */}
            {/* </section> */}

            <AnimatedArrow className='z-10' />
        </div>
    );
};

import styled from "styled-components";
import AnimatedArrow from "../../components/shared/AnimatedArrow.jsx";

export const Button = ({text, onClick, className }) => {
    return (
        <StyledWrapper>
            <button type="button" className={`btn ${className}`} onClick={onClick}>
                <strong>{text}</strong>
                <div id="container-stars">
                    <div id="stars" />
                </div>
                <div id="glow">
                    <div className="circle" />
                    <div className="circle" />
                </div>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        height: 3rem;
        width: 11rem;
        background-size: 300% 300%;
        cursor: pointer;
        backdrop-filter: blur(1rem);
        border-radius: 5rem;
        transition: 0.5s;
        animation: gradient_301 5s ease infinite;
        border: double 4px transparent;
        background-image: linear-gradient(#212121, #212121),
            linear-gradient(
                137.48deg,
                #ffdb3b 10%,
                #fe53bb 45%,
                #8f51ea 67%,
                #0044ff 87%
            );
        background-origin: border-box;
        background-clip: content-box, border-box;
    }

    #container-stars {
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: 0.5s;
        backdrop-filter: blur(1rem);
        border-radius: 5rem;
    }

    strong {
        z-index: 2;
        font-family: "Avalors Personal Use";
        font-size: 13px;
        letter-spacing: 5px;
        color: #ffffff;
        text-shadow: 0 0 4px white;
    }

    #glow {
        position: absolute;
        display: flex;
        width: 12rem;
    }

    .circle {
        width: 100%;
        height: 30px;
        filter: blur(2rem);
        animation: pulse_3011 4s infinite;
        z-index: -1;
    }

    .circle:nth-of-type(1) {
        background: rgba(254, 83, 186, 0.636);
    }

    .circle:nth-of-type(2) {
        background: rgba(142, 81, 234, 0.704);
    }

    .btn:hover #container-stars {
        z-index: 1;
        background-color: #212121;
    }

    /* .btn:hover {
        transform: scale(1.1);
    } */

    .btn:active {
        border: double 4px #fe53bb;
        background-origin: border-box;
        background-clip: content-box, border-box;
        animation: none;
    }

    .btn:active .circle {
        background: #fe53bb;
    }

    #stars {
        position: relative;
        background: transparent;
        width: 200rem;
        height: 200rem;
    }

    #stars::after {
        content: "";
        position: absolute;
        top: -10rem;
        left: -100rem;
        width: 100%;
        height: 100%;
        animation: animStarRotate 90s linear infinite;
    }

    #stars::after {
        background-image: radial-gradient(#ffffff 1px, transparent 1%);
        background-size: 50px 50px;
    }

    #stars::before {
        content: "";
        position: absolute;
        top: 0;
        left: -50%;
        width: 170%;
        height: 500%;
        animation: animStar 60s linear infinite;
    }

    #stars::before {
        background-image: radial-gradient(#ffffff 1px, transparent 1%);
        background-size: 50px 50px;
        opacity: 0.5;
    }

    @keyframes animStar {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(-135rem);
        }
    }

    @keyframes animStarRotate {
        from {
            transform: rotate(360deg);
        }

        to {
            transform: rotate(0);
        }
    }

    @keyframes gradient_301 {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes pulse_3011 {
        0% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
        }

        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }

        100% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }
`;

export default Hero;
