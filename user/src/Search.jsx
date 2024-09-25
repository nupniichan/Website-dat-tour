import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';

function Search() {
    const location = useLocation();
    const { city, date } = location.state || {};
    
    const [searchTerm, setSearchTerm] = useState(city || '');
    const [startDate, setStartDate] = useState(date || '');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/search?q=${selectedCity}&date=${departureDate}`);
            const data = await response.json();
    
            const filteredResults = data; 
    
            navigate("/search-results", { state: { results: filteredResults } });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    useEffect(() => {
        handleSearch();
    }, [searchTerm, startDate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="App">
            <h1>Tìm Kiếm Tour</h1>
            <div className="results">
                {results.map((item, index) => (
                    <div key={index} className="tour-card">
                        <img src={`http://localhost:5000/${item.HINHANH}`} alt={item.TENTOUR} className="tour-image" />
                        <div className="tour-info">
                            <h3 className="tour-name">{item.TENTOUR}</h3>
                            <p className='tour-price'>
                                {item.GIA ? parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}
                            </p>
                            <p className='tour-di'>{formatDate(item.NGAYDI)} {'->'} {formatDate(item.NGAYVE)}</p>
                            <p className='tour-vehicle'>Phương tiện di chuyển: {item.PHUONGTIENDICHUYEN} - Xe Buýt</p>
                            <p className='tour-ticket-available'>{item.SOVECONLAI} vé còn lại</p>
                            <p className='tour-type'>{item.LOAITOUR}</p>
                        </div>
                        <div className="button-container">
                            <button>Đặt ngay</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
