import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './SearchResult.css';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo navigate
    const { results: initialResults } = location.state || {};
    const [filteredResults, setFilteredResults] = useState(initialResults || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage] = useState(5);

    // Các state khác cho bộ lọc
    const [transportation, setTransportation] = useState('');
    const [tourType, setTourType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterResults = useCallback(() => {
        const filtered = initialResults.filter(item => {
            const price = parseFloat(item.GIA);
            const isTransportationMatch = transportation ? item.PHUONGTIENDICHUYEN === transportation : true;
            const isTypeMatch = tourType ? item.LOAITOUR === tourType : true;
            const isStartDateMatch = startDate ? dayjs(item.NGAYDI).isSame(dayjs(startDate), 'day') : true;
            const isEndDateMatch = endDate ? dayjs(item.NGAYVE).isSame(dayjs(endDate), 'day') : true;
            const isMinPriceMatch = minPrice ? price >= parseFloat(minPrice) : true;
            const isMaxPriceMatch = maxPrice ? price <= parseFloat(maxPrice) : true;

            return isTransportationMatch && isTypeMatch && isStartDateMatch && isEndDateMatch && isMinPriceMatch && isMaxPriceMatch;
        });

        setFilteredResults(filtered);
    }, [initialResults, transportation, tourType, minPrice, maxPrice, startDate, endDate]);

    useEffect(() => {
        filterResults();
    }, [filterResults]);

    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredResults.slice(indexOfFirstTour, indexOfLastTour);

    const nextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredResults.length / toursPerPage)));
    const prevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

    // Hàm chuyển đến trang chi tiết tour
    const goToTourDetails = (tour) => {
        navigate(`/tour-details/${tour.ID}`); // Điều hướng đến TourDetails với tourId trong URL
    };

    // Hàm chuyển đến trang checkout
    const goToCheckout = (tour) => {
        navigate(`/checkout/${tour.ID}`); // Thay đổi `navigate(/checkout/${tour.ID})` thành `navigate(`/checkout/${tour.ID})` với dấu ngoặc kép
    };

    return (
        <div className="search-results-container">
            <div className="filter-bar">
                <label htmlFor="transportation">Phương tiện:</label>
                <select id="transportation" value={transportation} onChange={(e) => setTransportation(e.target.value)}>
                    <option value="">Chọn phương tiện</option>
                    <option value="Xe Buýt">Xe Buýt</option>
                    <option value="Máy bay">Máy bay</option>
                    <option value="Thuyền">Thuyền</option>
                    <option value="Tàu hoả">Tàu hoả</option>
                </select>

                <label htmlFor="tourType">Loại tour:</label>
                <select id="tourType" value={tourType} onChange={(e) => setTourType(e.target.value)}>
                    <option value="">Chọn loại tour</option>
                    <option value="Tour trong nước">Tour trong nước</option>
                    <option value="Tour quốc tế">Tour quốc tế</option>
                </select>

                <label htmlFor="startDate">Ngày đi:</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                <label htmlFor="endDate">Ngày về:</label>
                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                <label htmlFor="minPrice">Giá tối thiểu:</label>
                <input id="minPrice" type="number" placeholder="Giá tối thiểu" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

                <label htmlFor="maxPrice">Giá tối đa:</label>
                <input id="maxPrice" type="number" placeholder="Giá tối đa" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            <div className="results">
                {currentTours && currentTours.length > 0 ? (
                    currentTours.map((item, index) => (
                        <div key={index} className="tour-card" onClick={() => goToTourDetails(item)}>
                            <img src={`http://localhost:5000/${item.HINHANH}`} alt={item.TENTOUR} className="tour-image" onError={(e) => e.target.src = 'default-image.jpg'} />
                            <div className="tour-info">
                                <h3 className="tour-name">{item.TENTOUR}</h3>
                                <div className="tour-details">
                                    <div className="tour-dates-vehicle">
                                        <div className="tour-di">
                                            <img src="/public/images/calendar_icon.png" alt="calendar icon" className="icon" />
                                            Ngày: {dayjs(item.NGAYDI).format("DD-MM-YYYY")} {'->'} {dayjs(item.NGAYVE).format("DD-MM-YYYY")}
                                        </div>
                                        <div className="tour-vehicle">
                                            <img src="/public/images/vehicle_icon.png" alt="vehicle icon" className="icon" />
                                            Phương tiện: {item.PHUONGTIENDICHUYEN}
                                        </div>
                                    </div>
                                    <div className="tour-ticket-available">
                                        <img src="/public/images/ticket_icon.png" alt="ticket icon" className="icon" />
                                        Còn lại: {item.SOVE} vé
                                    </div>
                                    <div className="tour-price">
                                        <img src="/public/images/price_icon.png" alt="price icon" className="icon" />
                                        {item.GIA ? parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div className="button-container">
                                <button onClick={(e) => { 
                                    e.stopPropagation(); // Ngăn chặn sự kiện nổi lên thẻ cha
                                    goToCheckout(item); // Điều hướng đến trang checkout
                                }}>
                                    Đặt ngay
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy kết quả.</p>
                )}

                <div className="pagination">
                    <button className="prev-page" onClick={prevPage} disabled={currentPage === 1}>Trang trước</button>
                    <button className="next-page" onClick={nextPage} disabled={currentPage === Math.ceil(filteredResults.length / toursPerPage)}>Trang sau</button>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
