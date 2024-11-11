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
                            <div className="relative">
                                <img 
                                    src={`http://localhost:5000/${item.HINHANH}`} 
                                    alt={item.TENTOUR} 
                                    className="tour-image" 
                                    onError={(e) => e.target.src = 'default-image.jpg'} 
                                />
                                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                    {item.LOAITOUR}
                                </div>
                                {item.SOVE <= 10 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                        Còn {item.SOVE} vé!
                                    </div>
                                )}
                            </div>

                            <div className="tour-info p-6">
                                <h3 className="tour-name text-xl font-bold mb-3">{item.TENTOUR}</h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span>Khởi hành: {item.KHOIHANH}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{dayjs(item.NGAYVE).diff(dayjs(item.NGAYDI), 'day')} ngày {dayjs(item.NGAYVE).diff(dayjs(item.NGAYDI), 'day') - 1} đêm</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm text-gray-500">Ngày đi</div>
                                                <div className="font-medium">{dayjs(item.NGAYDI).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm text-gray-500">Ngày về</div>
                                                <div className="font-medium">{dayjs(item.NGAYVE).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        <span className="text-gray-600">{item.PHUONGTIENDICHUYEN}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Giá từ</div>
                                        <div className="text-2xl font-bold text-orange-500">
                                            {parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.MOTA}</p>

                                <div className="flex justify-end">
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            goToCheckout(item);
                                        }}
                                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Đặt ngay
                                    </button>
                                </div>
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
