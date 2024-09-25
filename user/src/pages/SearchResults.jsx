import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './SearchResult.css';

const SearchResults = () => {
    const location = useLocation();
    const { results: initialResults } = location.state || {};

    const [filteredResults, setFilteredResults] = useState(initialResults || []);
    const [transportation, setTransportation] = useState('');
    const [tourType, setTourType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterResults = () => {
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
    };

    useEffect(() => {
        filterResults();
    }, [transportation, tourType, minPrice, maxPrice, startDate, endDate]);

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
                {filteredResults && filteredResults.length > 0 ? (
                    filteredResults.map((item, index) => (
                        <div key={index} className="tour-card">
                            <img src={`http://localhost:5000/${item.HINHANH}`} alt={item.TENTOUR} className="tour-image" onError={(e) => e.target.src = 'default-image.jpg'} />
                            <div className="tour-info">
                                <h3 className="tour-name">{item.TENTOUR}</h3>
                                <div>
                                    <p className='tour-price'>{item.GIA ? parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}</p>
                                    <p className='tour-di'>{dayjs(item.NGAYDI).format("DD-MM-YYYY")} {'->'} {dayjs(item.NGAYVE).format("DD-MM-YYYY")}</p>
                                    <p className='tour-vehicle'>Phương tiện di chuyển: {item.PHUONGTIENDICHUYEN} - Xe Buýt</p>
                                    <p className='tour-ticket-available'>{item.SOVECONLAI} vé còn lại</p>
                                    <p className='tour-type'>Loại tour: {item.LOAITOUR}</p>
                                </div>
                            </div>
                            <div className="button-container">
                                <button >Đặt ngay</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
