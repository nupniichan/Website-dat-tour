import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TourHistory.css'; 

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = String(date.getFullYear()).slice(-2); 
  return `${day}/${month}/${year}`;
};

const TourHistory = () => {
  const [tourHistory, setTourHistory] = useState([]);

  useEffect(() => {
    const fetchTourHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tour-history');
        setTourHistory(response.data);
      } catch (error) {
        console.error('Error fetching tour history:', error);
      }
    };

    fetchTourHistory();
  }, []);

  return (
    <div className="tour-history-container">
      <h1>Lịch sử đặt tour</h1>
      <table className="tour-history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày đặt</th>
            <th>Số vé</th>
            <th>Loại vé</th>
            <th>Tình trạng</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {tourHistory.length > 0 ? (
            tourHistory.map((item) => (
              <tr key={item.ID}>
                <td>{item.ID}</td>
                <td>{formatDate(item.NGAYDAT)}</td> 
                <td>{item.SOVE}</td>
                <td>{item.LOAIVE}</td>
                <td>{item.TINHTRANG}</td>
                <td>{item.TONGTIEN} VND</td> 
                <td>{item.PHUONGTHUCTHANHTOAN}</td>
                <td>{item.GHICHU}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Không có lịch sử đặt tour.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TourHistory;



