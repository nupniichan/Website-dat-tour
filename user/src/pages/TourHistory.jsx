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

const CancelDialog = ({ isOpen, onClose, onConfirm, selectedTicket, cancelReason, setCancelReason, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-form">
        <h2>Chọn lý do hủy vé</h2>
        <select
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        >
          <option value="">Chọn lý do</option>
          <option value="Bận công việc">Bận công việc</option>
          <option value="Thay đổi kế hoạch">Thay đổi kế hoạch</option>
          <option value="Lý do cá nhân">Lý do cá nhân</option>
        </select>
        <div className="dialog-actions">
          <button
            className="dialog-confirm"
            onClick={onConfirm}
            disabled={isProcessing} // Không cho nhấn khi đang xử lý
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận hủy vé'}
          </button>
          <button className="dialog-cancel" onClick={onClose}>
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

const TourHistory = () => {
  const [tourHistory, setTourHistory] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const openCancelDialog = (ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setCancelReason('');
  };

  const handleCancelTicket = async () => {
    if (!cancelReason) {
      alert('Vui lòng chọn lý do hủy.');
      return;
    }

    setIsProcessing(true);
    try {
      await axios.post(`http://localhost:5000/api/tour-history/cancel/${selectedTicket.ID}`, {
        reason: cancelReason,
      });
      alert(`Vé có ID ${selectedTicket.ID} đã được hủy.`);

      setTourHistory((prev) =>
        prev.map((item) =>
          item.ID === selectedTicket.ID ? { ...item, TINHTRANG: 'Đã hủy' } : item
        )
      );

      closeCancelDialog();
    } catch (error) {
      console.error('Error canceling ticket:', error);
      alert('Hủy vé thất bại.');
    } finally {
      setIsProcessing(false);
    }
  };

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
            <th>Chức năng</th>
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
                <td>
                  <button
                    className={`cancel-button ${item.TINHTRANG === 'Đã hủy' ? 'disabled' : ''}`}
                    onClick={item.TINHTRANG === 'Đã hủy' ? null : () => openCancelDialog(item)}
                    disabled={item.TINHTRANG === 'Đã hủy'} // Vô hiệu hóa nút khi vé đã hủy
                  >
                    {item.TINHTRANG === 'Đã hủy' ? 'Đã hủy' : 'Hủy vé'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có lịch sử đặt tour.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Dialog form để chọn lý do hủy */}
      <CancelDialog 
        isOpen={isDialogOpen} 
        onClose={closeCancelDialog} 
        onConfirm={handleCancelTicket} 
        selectedTicket={selectedTicket} 
        cancelReason={cancelReason} 
        setCancelReason={setCancelReason} 
        isProcessing={isProcessing} 
      />
    </div>
  );
};

export default TourHistory;
