import React, { useState } from 'react';
import './Search.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [transportation, setTransportation] = useState('');
  const [tourType, setTourType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      const filteredResults = data.filter(item => {
        const price = parseFloat(item.GIA);
        const isTransportationMatch = transportation ? item.PHUONGTIENDICHUYEN === transportation : true;
        const isTypeMatch = tourType ? item.LOAITOUR === tourType : true;
        const isStartDateMatch = startDate ? new Date(item.NGAYDI).toDateString() === new Date(startDate).toDateString() : true;
        const isEndDateMatch = endDate ? new Date(item.NGAYVE).toDateString() === new Date(endDate).toDateString() : true;
        const isMinPriceMatch = minPrice ? price >= parseFloat(minPrice) : true;
        const isMaxPriceMatch = maxPrice ? price <= parseFloat(maxPrice) : true;
  
        return isTransportationMatch && isTypeMatch && isStartDateMatch && isEndDateMatch && isMinPriceMatch && isMaxPriceMatch;
      });
  
      setResults(filteredResults);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    }
  };  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="App">
      <h1>Tìm Kiếm Tour</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm"
        />
      </div>
      
      <div className="filter-bar">
        <select value={transportation} onChange={(e) => setTransportation(e.target.value)}>
          <option value="">Chọn phương tiện</option>
          <option value="Xe Buýt">Xe Buýt</option>
          <option value="Máy bay">Máy bay</option>
          <option value="Thuyền">Thuyền</option>
          <option value="Tàu hoả">Tàu hoả</option>
        </select>

        <select value={tourType} onChange={(e) => setTourType(e.target.value)}>
          <option value="">Chọn loại tour</option>
          <option value="Tour quốc tế">Tour quốc tế</option>
          <option value="Tour trong nước">Tour trong nước</option>
        </select>

        <input
          type="date"
          placeholder="Ngày đi"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <input
          type="date"
          placeholder="Ngày về"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        
        <input
          type="number"
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="tour-card">
            <img src={"http://localhost:5000/" + item.HINHANH} alt={item.TENTOUR} className="tour-image" />
            <div className="tour-info">
              <h3 className="tour-name">{item.TENTOUR}</h3>
              <p className='tour-price'>
                {item.GIA ? parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}
              </p>
              <p className='tour-di'>{formatDate(item.NGAYDI)} {'->'} {formatDate(item.NGAYVE)}</p>
              <p className='tour-vehicle'>{item.PHUONGTIENDICHUYEN}</p>
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
