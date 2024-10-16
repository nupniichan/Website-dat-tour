import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './TourDetails.css';

const TourDetails = () => {
    const { id } = useParams(); // Lấy tourId từ URL
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo navigate để điều hướng
    const [tour, setTour] = useState(location.state?.tour || null); // Lấy từ state nếu có

    useEffect(() => {
        if (!tour) {
            // Nếu không có tour trong state, gọi API để lấy thông tin
            fetch(`http://localhost:5000/tours/${id}`)
                .then((response) => response.json())
                .then((data) => setTour(data))
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
                        <li>Ngày 1: Lên xe lúc 22:05 - Lên xe đi Đà Lạt</li>
                        <li>Ngày 1: Ăn tối tại nhà hàng bảy xạy lúc 21:05</li>
                        <li>Ngày 2: Đi về TP.HCM lúc 12:11</li>
                    </ul>
                </div>
            </div>
            <div className="tour-right">
                <h2>Thông tin tour</h2>
                <p><strong>Ngày đi:</strong> {dayjs(tour.NGAYDI).format('DD-MM-YYYY')}</p>
                <p><strong>Ngày về:</strong> {dayjs(tour.NGAYVE).format('DD-MM-YYYY')}</p>
                <p><strong>Phương tiện:</strong> {tour.PHUONGTIENDICHUYEN}</p>
                <p><strong>Giá:</strong> {tour.GIA ? parseFloat(tour.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}</p>
                <p><strong>Còn lại:</strong> {tour.SOVECONLAI} vé</p>
                
                {/* Thêm nút "Đặt ngay" */}
                <div className="button-container">
                    <button className="book-now-button" onClick={handleCheckout}>Đặt ngay</button>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
