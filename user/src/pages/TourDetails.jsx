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
    const { id } = useParams(); // Lấy id từ URL
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo navigate để điều hướng
    const [tour, setTour] = useState(location.state?.tour || null); // Lấy từ state nếu có
    const [scheduleDetails, setScheduleDetails] = useState([]);

    useEffect(() => {
        if (!tour) {
            // Nếu không có tour trong state, gọi API để lấy thông tin tour
            fetch(`http://localhost:5000/tours/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setTour(data);
                    // Gọi API để lấy chi tiết lịch trình
                    fetch(`http://localhost:5000/schedules/${data.IDLICHTRINH}`)
                        .then((response) => response.json())
                        .then((scheduleData) =>
                            setScheduleDetails(scheduleData.details)
                        )
                        .catch((error) =>
                            console.error(
                                "Error fetching schedule details:",
                                error
                            )
                        );
                })
                .catch((error) =>
                    console.error("Error fetching tour details:", error)
                );
        }
    }, [id, tour]);

    // Hàm điều hướng đến trang checkout
    const handleCheckout = () => {
        navigate(`/checkout/${tour.ID}`);
    };

    if (!tour) {
        return <p>Không tìm thấy thông tin tour.</p>;
    }

    return (
        <div className="container flex justify-center">
            <div className="tour-details-container">
                <div className="tour-left">
                    <img
                        src={`http://localhost:5000/${tour.HINHANH}`}
                        alt={tour.TENTOUR}
                        className="tour-image"
                        onError={(e) => (e.target.src = "default-image.jpg")}
                    />
                    <h1 className="tour-title">{tour.TENTOUR}</h1>
                    <p className="tour-description">
                        {tour.MOTA || "Chưa có mô tả."}
                    </p>
                    <div className="tour-itinerary">
                        <h2>Chi tiết lịch trình</h2>
                        <ul>
                            {scheduleDetails.length > 0 ? (
                                scheduleDetails.map((detail, index) => (
                                    <li key={index}>
                                        <strong>Ngày {index + 1}:</strong>{" "}
                                        {dayjs(detail.NGAY).format(
                                            "DD/MM/YYYY"
                                        )}{" "}
                                        - {detail.GIO} - {detail.SUKIEN}
                                        <p>{detail.MOTA}</p>
                                    </li>
                                ))
                            ) : (
                                <p>Chưa có chi tiết lịch trình.</p>
                            )}
                        </ul>
                    </div>

                    {/* RIGHT INFO SECTION */}
                    <div className="right-info-section border-shadow scale-[70%]">
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
                                            Khởi hành:{" "}
                                            <span>TP. Hồ Chí Minh</span>
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
                                            <span>
                                                {tour.PHUONGTIENDICHUYEN}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="tour-price--info__content__item">
                                    <div className="label">
                                        <Seats />
                                        <p>
                                            Số chỗ còn:{" "}
                                            <span>{tour.SOVE} chỗ</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
