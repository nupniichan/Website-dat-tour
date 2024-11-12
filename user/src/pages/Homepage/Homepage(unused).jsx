import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import cities from "../../json/cities.json";
import "../Homepage.css";

dayjs.locale('vi');

const Homepage = () => {
    // const [filteredCities, setFilteredCities] = useState(cities);
    // const [selectedCity, setSelectedCity] = useState("");
    // const [departureDate, setDepartureDate] = useState("");
    const [featuredTours, setFeaturedTours] = useState([]);
    const navigate = useNavigate();

    // const disablePastDates = (current) => {
    //     return current && current < dayjs().endOf('day');
    // };

    // const onCityChange = (value) => {
    //     setSelectedCity(value);
    // };

    // const onSearch = (value) => {
    //     const filtered = value
    //         ? cities.filter((city) =>
    //               city.city.toLowerCase().includes(value.toLowerCase())
    //           )
    //         : cities;
    //     setFilteredCities(filtered);
    // };

    // const onDateChange = (date, dateString) => {
    //     setDepartureDate(dateString);
    // };

    // const handleSearch = async () => {
    //     if (!selectedCity) {
    //         alert("Vui lòng chọn điểm đến.");
    //         return;
    //     }

    //     if (!departureDate) {
    //         alert("Vui lòng chọn ngày khởi hành.");
    //         return;
    //     }

    //     const formattedDate = dayjs(departureDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    //     const apiUrl = `http://localhost:5000/search/tour-with-date?q=${selectedCity}&date=${formattedDate}`;

    //     try {
    //         const response = await fetch(apiUrl);
    //         if (!response.ok) {
    //             throw new Error('Lỗi mạng.');
    //         }

    //         const data = await response.json();
    //         const filteredResults = data;
    //         navigate(`/search/${selectedCity}/${formattedDate}`, { state: { results: filteredResults } });
    //     } catch (error) {
    //         console.error('Lỗi khi lấy dữ liệu:', error);
    //     }
    // };

    useEffect(() => {
        const fetchFeaturedTours = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/featured-tours');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setFeaturedTours(data);
            } catch (error) {
                console.error('Error fetching featured tours:', error);
            }
        };

        fetchFeaturedTours();
    }, []);

    const handleDestinationClick = async (cityName) => {
        const departureDate = dayjs().add(2, 'day').format('YYYY-MM-DD');

        try {
            const apiUrl = `http://localhost:5000/search/tour-with-date?q=${cityName}&date=${departureDate}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Lỗi mạng.');
            }

            const data = await response.json();

            navigate(`/search/${cityName}/${departureDate}`, {
                state: { results: data }
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    return (
        <>
            {/* <div id="hero-container" className="bg-gray-900">
                <section className="relative">
                    <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                        <div className="home-search space-y-5 max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl pb-3">
                                Your dream vacation, tailored to perfection

                            </h2>

                            <div className="search-form absolute z-30 font-normal xl:w-[1128px] bg-white border border-[rgba(239,82,34,0.6)] rounded-xl p-6 outline outline-8 outline-[rgba(170,46,8,0.1)]">
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
                                    <button onClick={handleSearch} className="absolute z-10 h-12 rounded-full bg-orange-500 hover:bg-orange-400 px-20 text-base text-white transition duration-200">
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
            </div> */}

            <main className="main mt-[100px]">
                {/* Popular Destinations */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 top-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Điểm Đến Phổ Biến</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {cities.slice(0, 6).map((city, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2 cursor-pointer"
                                    onClick={() => handleDestinationClick(city.city)}
                                >
                                    <img
                                        src={city.image || `/src/assets/cities/${city.city}.jpg`}
                                        alt={city.city}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">{city.city}</h3>
                                        <p className="text-gray-600">{city.description || "Khám phá vẻ đẹp và văn hóa độc đáo"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Chọn Chúng Tôi?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Giá Cả Hợp Lý</h3>
                                <p className="text-gray-600">Cam kết mang đến những tour du lịch chất lượng với giá tốt nhất</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">An Toàn & Tin Cậy</h3>
                                <p className="text-gray-600">Đảm bảo an toàn và chất lượng dịch vụ cho mọi chuyến đi</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Tiết Kiệm Thời Gian</h3>
                                <p className="text-gray-600">Quy trình đặt tour nhanh chóng và thuận tiện</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Hỗ Trợ 24/7</h3>
                                <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng phục vụ</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Tours */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Tour Du Lịch Nổi Bật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredTours.map((tour, index) => (
                                <div key={tour.ID} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={`http://localhost:5000/${tour.HINHANH}`}
                                            alt={tour.TENTOUR}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/src/assets/tour-default.jpg";
                                            }}
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                                                Hot
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full">
                                            {tour.LOAITOUR}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{tour.TENTOUR}</h3>
                                        <div className="flex items-center mb-4">
                                            <span className="text-orange-500 font-bold text-xl">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(tour.GIA)}
                                            </span>
                                            <span className="text-gray-500 text-sm ml-2">/người</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{tour.KHOIHANH}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{dayjs(tour.NGAYDI).format('DD/MM/YYYY')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>
                                                {dayjs(tour.NGAYVE).diff(dayjs(tour.NGAYDI), 'day')} ngày {dayjs(tour.NGAYVE).diff(dayjs(tour.NGAYDI), 'day') - 1} đêm
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <span>{tour.PHUONGTIENDICHUYEN}</span>
                                        </div>
                                        {tour.rating && (
                                            <div className="flex items-center text-gray-600 text-sm mb-4">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${
                                                                i < Math.round(tour.rating)
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="ml-1">({tour.review_count || 0} đánh giá)</span>
                                            </div>
                                        )}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.MOTA}</p>
                                        <button
                                            onClick={() => navigate(`/tour-details/${tour.ID}`)}
                                            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="py-16 bg-orange-500">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Thông Tin</h2>
                            <p className="mb-8">Nhận thông tin về các tour mới và ưu đãi hấp dẫn</p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="px-6 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
                                />
                                <button className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Homepage;
