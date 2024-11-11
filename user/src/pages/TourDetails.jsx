import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Calendar from "../assets/svg/Calendar";
import Clock from "../assets/svg/Clock";
import Location from "../assets/svg/Location";
import Seats from "../assets/svg/Seats";
import Ticket from "../assets/svg/Ticket";
import Vehicle from "../assets/svg/Vehicle";
import "./TourDetails.css";

const TourDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [tour, setTour] = useState(location.state?.tour || null);
    const [scheduleDetails, setScheduleDetails] = useState([]);

    useEffect(() => {
        // Fetch tour data if not available
        if (!tour) {
            fetch(`http://localhost:5000/tours/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setTour(data);
                    fetchScheduleDetails(data.IDLICHTRINH);
                })
                .catch((error) =>
                    console.error("Error fetching tour details:", error)
                );
        } else {
            fetchScheduleDetails(tour.IDLICHTRINH);
        }
    }, [id, tour]);

    const fetchScheduleDetails = (scheduleId) => {
        fetch(`http://localhost:5000/schedules/${scheduleId}`)
            .then((response) => response.json())
            .then((scheduleData) => setScheduleDetails(scheduleData.details))
            .catch((error) =>
                console.error("Error fetching schedule details:", error)
            );
    };

    const handleCheckout = () => {
        navigate(`/checkout/${tour.ID}`);
    };

    if (!tour) {
        return (
            <div className="text-center py-8">Đang tải thông tin tour...</div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tour Header */}
            <div className="mb-8">
                <div className="relative h-[500px] rounded-xl overflow-hidden mb-6">
                    <img
                        src={`http://localhost:5000/${tour.HINHANH}`}
                        alt={tour.TENTOUR}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/default-image.jpg")}
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-500 text-white px-4 py-2 rounded-full">
                            {tour.LOAITOUR}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">
                            {tour.TENTOUR}
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Giá từ</div>
                        <div className="text-3xl font-bold text-orange-500">
                            {parseFloat(tour.GIA).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tour Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Thông tin cơ bản */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        Thông tin cơ bản
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
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
                            </svg>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Điểm khởi hành
                                </div>
                                <div className="font-medium">
                                    {tour.KHOIHANH}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
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
                            <div>
                                <div className="text-sm text-gray-500">
                                    Thời gian
                                </div>
                                <div className="font-medium">
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
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
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
                            <div>
                                <div className="text-sm text-gray-500">
                                    Phương tiện
                                </div>
                                <div className="font-medium">
                                    {tour.PHUONGTIENDICHUYEN}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Số chỗ còn nhận
                                </div>
                                <div className="font-medium">
                                    {tour.SOVE} vé
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT INFO SECTION */}
                {/* <div className="right-info-section border-shadow scale-[70%]">
                    <div className="tour-price">
                        <div className="price--oldPrice">
                            <h4>Giá:</h4>
                            <div className="price--discount"></div>
                        </div>
                        <div className="price">
                            <p>
                                {tour.GIA
                                    ? parseFloat(tour.GIA).toLocaleString(
                                          "vi-VN",
                                          {
                                              style: "currency",
                                              currency: "VND",
                                          }
                                      )
                                    : "N/A"}
                                <span> / Khách</span>
                            </p>
                        </div>
                    </div>
                    <div className="tour-price--info">
                        <div className="tour-price--info__content">
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Ticket />
                                    <p>
                                        Mã tour: <span>{tour.ID}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Location />
                                    <p>
                                        Khởi hành: <span>TP. Hồ Chí Minh</span>
                                    </p>
                                </div>
                            </div>
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Calendar />
                                    <p>
                                        Ngày khởi hành:{" "}
                                        <span>
                                            {dayjs(tour.NGAYDI).format(
                                                "DD-MM-YYYY"
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Clock />
                                    <p>
                                        Thời gian: <span>5N4Đ</span>
                                    </p>
                                </div>
                            </div>
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Vehicle />
                                    <p>
                                        Phương tiện:{" "}
                                        <span>{tour.PHUONGTIENDICHUYEN}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="tour-price--info__content__item">
                                <div className="label">
                                    <Seats />
                                    <p>
                                        Số chỗ còn: <span>{tour.SOVE} chỗ</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="book-tour-option">
                        <button
                            className="btn-book rounded-lg btn-bookTour button"
                            type="button"
                            aria-label="Đặt tour"
                            onClick={handleCheckout}
                        >
                            Đặt tour
                        </button>
                    </div>
                </div> */}

                {/* Lịch trình */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Lịch trình</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
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
                            <div>
                                <div className="text-sm text-gray-500">
                                    Ngày khởi hành
                                </div>
                                <div className="font-medium">
                                    {dayjs(tour.NGAYDI).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3 text-orange-500"
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
                            <div>
                                <div className="text-sm text-gray-500">
                                    Ngày kết thúc
                                </div>
                                <div className="font-medium">
                                    {dayjs(tour.NGAYVE).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Đặt tour */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Đặt tour</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Giá thông thường
                            </span>
                            <span className="font-medium">
                                {parseFloat(tour.GIA).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Số chỗ còn nhận
                            </span>
                            <span className="font-medium">{tour.SOVE} vé</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Đặt ngay
                    </button>
                </div>
            </div>

            {/* Mô tả tour */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Mô tả tour</h2>
                <div className="prose max-w-none">
                    {tour.MOTA || "Chưa có mô tả chi tiết."}
                </div>
            </div>

            {/* Chi tiết lịch trình */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Chi tiết lịch trình
                </h2>
                {scheduleDetails.length > 0 ? (
                    <div className="space-y-6">
                        {scheduleDetails.map((detail, index) => (
                            <div
                                key={index}
                                className="border-l-4 border-orange-500 pl-4"
                            >
                                <div className="font-semibold mb-2">
                                    Ngày {index + 1}:{" "}
                                    {dayjs(detail.NGAY).format("DD/MM/YYYY")}
                                </div>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
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
                                    {detail.GIO}
                                </div>
                                <div className="mb-2 font-medium">
                                    {detail.SUKIEN}
                                </div>
                                <p className="text-gray-600">{detail.MOTA}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        Chưa có chi tiết lịch trình.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TourDetails;
