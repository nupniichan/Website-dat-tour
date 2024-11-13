import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import PagesNames from "../../Router/PagesNames.js";

const PopularTours = () => {
    const [featuredTours, setFeaturedTours] = useState([])
    const navigate = useNavigate();

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

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Tour Du Lịch Nổi Bật
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-14">
                    {featuredTours.map((tour, index) => (
                        <div
                            key={tour.ID}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={`http://localhost:5000/${tour.HINHANH}`}
                                    alt={tour.TENTOUR}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "/src/assets/tour-default.jpg";
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
                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                                    {tour.TENTOUR}
                                </h3>
                                <div className="flex items-center mb-4">
                                    <span className="text-orange-500 font-bold text-xl">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(tour.GIA)}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        /người
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span>{tour.KHOIHANH}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>
                                            {dayjs(tour.NGAYDI).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        {dayjs(tour.NGAYVE).diff(
                                            dayjs(tour.NGAYDI),
                                            "day"
                                        )}{" "}
                                        ngày{" "}
                                        {dayjs(tour.NGAYVE).diff(
                                            dayjs(tour.NGAYDI),
                                            "day"
                                        ) - 1}{" "}
                                        đêm
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
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
                                                        i <
                                                        Math.round(tour.rating)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-1">
                                            ({tour.review_count || 0} đánh giá)
                                        </span>
                                    </div>
                                )}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {tour.MOTA}
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(`${PagesNames.TOUR_DETAILS}/${tour.ID}`)
                                    }
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
    );
};

export default PopularTours;
