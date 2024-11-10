import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './TourDetails.css';

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
                        .then((scheduleData) => setScheduleDetails(scheduleData.details))
                        .catch((error) => console.error('Error fetching schedule details:', error));
                })
                .catch((error) => console.error('Error fetching tour details:', error));
        }
    }, [id, tour]);

    // Hàm điều hướng đến trang checkout
    const handleCheckout = () => {
        navigate(`/checkout/${tour.ID}`); // Sử dụng dấu `\`` để định dạng URL đúng
    };

    if (!tour) {
        return <p>Không tìm thấy thông tin tour.</p>;
    }

    return (
        <div className="tour-details-container">
            <div className="tour-left">
                <img src={`http://localhost:5000/${tour.HINHANH}`} alt={tour.TENTOUR} className="tour-image" onError={(e) => e.target.src = 'default-image.jpg'} />
                <h1 className="tour-title">{tour.TENTOUR}</h1>
                <p className="tour-description">{tour.MOTA || 'Chưa có mô tả.'}</p>
                <div className="tour-itinerary">
                <h2>Chi tiết lịch trình</h2>
                    <ul>
                        {scheduleDetails.length > 0 ? (
                            scheduleDetails.map((detail, index) => (
                                <li key={index}>
                                    <strong>Ngày {index + 1}:</strong> {dayjs(detail.NGAY).format('DD/MM/YYYY')} - {detail.GIO} - {detail.SUKIEN}
                                    <p>{detail.MOTA}</p> {/* Mô tả xuống dòng */}
                                </li>
                            ))
                        ) : (
                            <p>Chưa có chi tiết lịch trình.</p>
                        )}
                    </ul>
                </div>
            </div>
            <div className="tour-right">
                <h2>Thông tin tour</h2>
                <p><strong>Ngày đi:</strong> {dayjs(tour.NGAYDI).format('DD-MM-YYYY')}</p>
                <p><strong>Ngày về:</strong> {dayjs(tour.NGAYVE).format('DD-MM-YYYY')}</p>
                <p><strong>Phương tiện:</strong> {tour.PHUONGTIENDICHUYEN}</p>
                <p><strong>Giá:</strong> {tour.GIA ? parseFloat(tour.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}</p>
                <p><strong>Còn lại:</strong> {tour.SOVE} vé</p>
                
                {/* Thêm nút "Đặt ngay" */}
                <div className="button-container">
                    <button className="book-now-button" onClick={handleCheckout}>Đặt ngay</button>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
