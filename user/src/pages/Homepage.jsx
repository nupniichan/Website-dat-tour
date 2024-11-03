import { useState } from "react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import cities from "../json/cities.json";
import "./Homepage.css";

const Homepage = () => {
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
            alert("Vui lòng chọn điểm đến.");
            return;
        }

        if (!departureDate) {
            alert("Vui lòng chọn ngày khởi hành.");
            return;
        }

        const formattedDate = dayjs(departureDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        const apiUrl = `http://localhost:5000/search/tour-with-date?q=${selectedCity}&date=${formattedDate}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Lỗi mạng.");
            }

            const data = await response.json();
            const filteredResults = data;
            navigate(`/search/${selectedCity}/${formattedDate}`, {
                state: { results: filteredResults },
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    return (
        <>
            <div id="hero-container" className="bg-gray-900">
                <section className="relative">
                    <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                        <div className="home-search space-y-5 max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl pb-3">
                                Your dream vacation, tailored to perfection
                            </h2>

                            <div className="search-form top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute z-30 font-normal xl:w-[1128px] bg-white border border-[rgba(239,82,34,0.6)] rounded-xl p-6 outline outline-8 outline-[rgba(170,46,8,0.1)]">
                                <div className="grid grid-cols-2 pb-4 pt-4">
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
                                            {filteredCities.map(
                                                (city, index) => (
                                                    <Select.Option
                                                        key={index}
                                                        value={city.city}
                                                    >
                                                        {city.city}
                                                    </Select.Option>
                                                )
                                            )}
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
                                    <button
                                        onClick={handleSearch}
                                        className="absolute z-10 h-12 rounded-full bg-orange-500 hover:bg-orange-400 px-20 text-base text-white transition duration-200"
                                    >
                                        Tìm kiếm
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
