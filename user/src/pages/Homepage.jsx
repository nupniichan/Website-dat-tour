import { useState } from "react";
import { Radio, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import cities from "../json/cities.json";
import "../App.css";
import "./Homepage.css";

const Homepage = () => {
    const [radioValue, setRadioValue] = useState(0);
    const [filteredCities, setFilteredCities] = useState(cities);
    const [selectedCity, setSelectedCity] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const tripTypeRadio = [{ type: "One-way" }, { type: "Round-trip" }];

    const navigate = useNavigate();

    const onChangeRadio = (e) => {
        setRadioValue(e.target.value);
    };

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
            alert("Please select a destination.");
            return;
        }

        const formattedDate = departureDate ? dayjs(departureDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '';

        // Gọi API tương ứng
        const apiUrl = departureDate ? 
            `http://localhost:5000/search/tour-with-date?q=${selectedCity}&date=${formattedDate}` :
            `http://localhost:5000/search/tour?q=${selectedCity}`;

        try {
            const response = await fetch(apiUrl);
            console.log("Response Status:", response.status);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("API Response:", data);

            const filteredResults = data;
            navigate(`/search/${selectedCity}/${formattedDate}`, { state: { results: filteredResults } });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <div id="hero-container" className="bg-gray-900">
                <section className="relative">
                    <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                        <div className="home-search space-y-5 max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl">
                                Đặt Tour Dễ Dàng, Tự Do Khám Phá!
                            </h2>
                            <div className="search-form absolute z-30 font-normal xl:w-[1128px] bg-white border border-[rgba(239,82,34,0.6)] rounded-xl p-6">
                                <div className="grid grid-cols-2 pb-4 pt-4">
                                    <div className="mr-4 flex flex-1 flex-col">
                                        <label className="text-left mb-1 text-sm">Điểm đi</label>
                                        <Select
                                            showSearch
                                            placeholder="Bạn muốn tham quan ở đâu?"
                                            onChange={onCityChange}
                                            onSearch={onSearch}
                                            filterOption={false}
                                            style={{ textAlign: "left", height: "4rem" }}
                                        >
                                            {filteredCities.map((city, index) => (
                                                <Select.Option key={index} value={city.city}>
                                                    {city.city}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="mr-4 flex flex-1 flex-col">
                                        <label className="text-left mb-1 text-sm">Ngày đi</label>
                                        <DatePicker
                                            format="DD-MM-YYYY"
                                            size="large"
                                            placeholder="Chọn ngày đi"
                                            disabledDate={disablePastDates}
                                            onChange={onDateChange}
                                            style={{ height: "4rem" }}
                                        />
                                    </div>
                                </div>
                                <div className="search-btn relative flex w-full justify-center">
                                    <button onClick={handleSearch} className="absolute z-10 h-12 rounded-full bg-orange-500 hover:bg-orange-400 px-20 text-base text-white transition duration-200">
                                        Tìm tour
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <main className="main mb-80">
                <div className="middle"></div>
            </main>
        </>
    );
};

export default Homepage;
