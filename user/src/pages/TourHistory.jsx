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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
            disabled={isProcessing} // Disable when processing
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

const TicketDetailsDialog = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="dialog-overlay">
      <div className="ticket-details-dialog">
        <h2>Chi tiết vé</h2>
        <p><strong>Mã vé:</strong> {ticket.ID}</p>
        <p><strong>Ngày đặt:</strong> {formatDate(ticket.NGAYDAT)}</p>
        <p><strong>Tổng số vé:</strong> {ticket.SOVE}</p>
        <p><strong>Số vé người lớn:</strong> {ticket.SOVE_NGUOILON}</p>
        <p><strong>Số vé trẻ em:</strong> {ticket.SOVE_TREM}</p>
        <p><strong>Số vé em bé:</strong> {ticket.SOVE_EMBE}</p>
        <p><strong>Tình trạng:</strong> {ticket.TINHTRANG}</p>
        <p><strong>Tổng tiền:</strong> {formatCurrency(ticket.TONGTIEN)}</p>
        <p><strong>Phương thức thanh toán:</strong> {ticket.PHUONGTHUCTHANHTOAN}</p>
        <p><strong>Ghi chú:</strong> {ticket.GHICHU || 'Không có ghi chú'}</p>
        <div className="dialog-actions">
          <button className="dialog-cancel" onClick={onClose}>
            Đóng
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
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  useEffect(() => {
    const userId = sessionStorage.getItem('userId'); // Retrieve user ID from session storage
    const fetchTourHistory = async () => {
      if (!userId) {
        console.error('User ID not found in session storage.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/tour-history/${userId}`); // Update API endpoint with userId
        setTourHistory(response.data);
      } catch (error) {
        console.error('Error fetching tour history:', error);
        alert('Lỗi khi lấy lịch sử đặt tour.');
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

  const openDetailsDialog = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedTicket(null);
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
            <th>Tổng số vé</th>
            <th>Tình trạng</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
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
                <td>{item.TINHTRANG}</td>
                <td>{formatCurrency(item.TONGTIEN)}</td>
                <td>{item.PHUONGTHUCTHANHTOAN}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => openDetailsDialog(item)}>
                      Xem chi tiết
                    </button>
                    {(item.TINHTRANG !== 'Đã hủy' && item.TINHTRANG !== 'Đã hoàn tiền') && (
                      <button
                        className="cancel-button"
                        onClick={() => openCancelDialog(item)}
                        disabled={isProcessing}
                      >
                        Hủy vé
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không có lịch sử đặt tour.</td>
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

      {/* Dialog hiển thị chi tiết vé */}
      <TicketDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default TourHistory;
