import { useState } from "react";
import { Radio, DatePicker, Select } from "antd";
import dayjs from "dayjs";

import cities from "../json/cities.json";
import "../App.css";
import "./Homepage.css";

const Homepage = () => {
    const [radioValue, setRadioValue] = useState(0);
    const [filteredCities, setFilteredCities] = useState(cities); // Hold the filtered cities
    const tripTypeRadio = [{ type: "One-way" }, { type: "Round-trip" }];

    const onChangeRadio = (e) => {
        setRadioValue(e.target.value);
    };

    const disablePastDates = (current) => {
        return current && current < dayjs().startOf("day");
    };

    const onChange = (value) => {
        console.log(`Selected: ${value}`);
    };

    const onSearch = (value) => {
        if (value) {
            const filtered = cities.filter(city =>
                city.city.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities(cities); // Reset if search is cleared
        }
    };

    return (
        <>
            <div id="hero-container" className="bg-gray-900">
                <section className="relative">
                    <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                        <div className="home-search space-y-5 max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl">
                                Your dream vacation, tailored to perfection
                            </h2>

                            <div className="search-form absolute z-30 font-normal xl:w-[1128px] bg-white border border-[rgba(239,82,34,0.6)] rounded-xl p-6 outline outline-8 outline-[rgba(170,46,8,0.1)]">
                                <div className="flex items-center justify-between">
                                    <Radio.Group onChange={onChangeRadio} value={radioValue} >
                                        <div className="radio-form flex justify-center space-x-4">
                                            {tripTypeRadio.map((tripType, index) => (
                                                    <Radio
                                                        key={index}
                                                        value={index}
                                                        className={`text-sm ant-radio-item ${
                                                            radioValue === index
                                                                ? `text-orange-600`
                                                                : `text-black`
                                                        }`}>
                                                        {tripType.type}
                                                    </Radio>
                                                )
                                            )}
                                        </div>
                                    </Radio.Group>
                                </div>

                                <div className="grid grid-cols-2 pb-4 pt-4 font">
                                    <div className="mr-4 flex flex-1 flex-col">
                                        <label className="text-left ml-5 mb-1 text-sm">
                                            Destination
                                        </label>
                                        <Select
                                            showSearch
                                            placeholder="Where do you wish to go?"
                                            optionFilterProp="label"
                                            onChange={onChange}
                                            onSearch={onSearch}
                                            filterOption={false}
                                            style={{textAlign: "left", height: "4rem"}}
                                        >
                                            {filteredCities.map((city, index) => (
                                                <Select.Option key={index} value={city.city} >
                                                    <h2 className="text-lg font-medium">
                                                        {city.city}
                                                    </h2>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="mr-4 flex flex-1 flex-col">
                                        <label className="text-left ml-5 mb-1 text-sm">
                                            Departure date
                                        </label>
                                        <DatePicker
                                            defaultValue={dayjs()}
                                            format="DD-MM-YYYY"
                                            size="large"
                                            disabledDate={disablePastDates}
                                            placeholder="Pick a date matey"
                                            style={{height: "4rem", }}
                                            className="font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="search-btn relative flex w-full justify-center">
                                    <button className="absolute z-10 h-12 rounded-full bg-orange-500 hover:bg-orange-400 px-20 text-base text-white transition duration-200">
                                        Search trip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
                        style={{
                            background:
                                "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(217, 181, 61, 0.26) 56.49%, rgba(244, 109, 42, 0.4) 115.91%)",
                        }}
                    ></div>
                </section>
            </div>

            <main className="main mb-80">
                <div className="middle"></div>
            </main>
        </>
    );
};

export default Homepage;
