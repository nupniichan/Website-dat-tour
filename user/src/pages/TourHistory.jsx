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

const CancelDialog = ({ isOpen, onClose, onConfirm, cancelReason, setCancelReason, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-form" onClick={(e) => e.stopPropagation()}>
        <h2>Chọn lý do hủy vé</h2>
        <select
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        >
          <option value="">Chọn lý do</option>
          <option value="Bận công việc">Bận công việc</option>
          <option value="Thay đổi kế hoch">Thay đổi kế hoch</option>
          <option value="Lý do cá nhân">Lý do cá nhân</option>
        </select>
        <div className="dialog-actions">
          <button
            className="dialog-confirm"
            onClick={onConfirm}
            disabled={isProcessing || !cancelReason} // Disable when processing or no reason selected
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
    <div className="dialog-overlay" onClick={onClose}>
      <div className="ticket-details-dialog" onClick={(e) => e.stopPropagation()}>
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

const ReviewDialog = ({ isOpen, onClose, onSubmit, tour }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  if (!isOpen || !tour) return null;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá.');
      return;
    }
    if (content.trim() === '') {
      alert('Vui lòng nhập nội dung đánh giá.');
      return;
    }
    onSubmit(tour.IDTOUR, rating, content);
  };

  return (
    <div className="dialog-overlay">
      <div className="review-dialog">
        <h2>Đánh giá tour</h2>
        <div className="tour-details">
          <p><strong>Mã vé:</strong> {tour.ID}</p>
          <p><strong>Mã tour:</strong> {tour.IDTOUR}</p>
          <p><strong>Ngày đặt:</strong> {formatDate(tour.NGAYDAT)}</p>
          <p><strong>Tổng s�� vé:</strong> {tour.SOVE}</p>
          <p><strong>Số vé người lớn:</strong> {tour.SOVE_NGUOILON}</p>
          <p><strong>Số vé trẻ em:</strong> {tour.SOVE_TREM}</p>
          <p><strong>Số vé em bé:</strong> {tour.SOVE_EMBE}</p>
          <p><strong>Tình trạng:</strong> {tour.TINHTRANG}</p>
          <p><strong>Tổng tiền:</strong> {formatCurrency(tour.TONGTIEN)}</p>
          <p><strong>Phương thức thanh toán:</strong> {tour.PHUONGTHUCTHANHTOAN}</p>
          <p><strong>Ghi chú:</strong> {tour.GHICHU || 'Không có ghi chú'}</p>
        </div>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'active' : ''}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung đánh giá..."
        />
        <div className="dialog-actions">
          <button className="dialog-confirm" onClick={handleSubmit}>
            Gửi đánh giá
          </button>
          <button className="dialog-cancel" onClick={onClose}>
            Hủy
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
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedTourForReview, setSelectedTourForReview] = useState(null);

  const canCancelTicket = (ticket, tourDate) => {
    if (ticket.TINHTRANG === 'Chưa thanh toán' || ticket.TINHTRANG === 'Đã hủy' || ticket.TINHTRANG === 'Đã hoàn tiền') {
      return false;
    }

    const departureDate = new Date(tourDate);
    const now = new Date();
    
    if (now > departureDate) {
      return false;
    }

    const hoursDifference = (departureDate - now) / (1000 * 60 * 60);
    
    return hoursDifference > 24;
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log(userId);
    const fetchTourHistory = async () => {
      if (!userId) {
        console.error('User ID not found in session storage.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/tour-history/${userId}`);
        // Fetch tour dates for each ticket
        const ticketsWithTourDates = await Promise.all(
          response.data.map(async (ticket) => {
            const tourResponse = await axios.get(`http://localhost:5000/api/tour/${ticket.IDTOUR}`);
            const scheduleResponse = await axios.get(`http://localhost:5000/schedules/${tourResponse.data.IDLICHTRINH}`);
            return {
              ...ticket,
              NGAYDI: tourResponse.data.NGAYDI,
              NGAYVE: scheduleResponse.data.schedule.NGAYVE
            };
          })
        );
        setTourHistory(ticketsWithTourDates);
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
    if (!selectedTicket) return;
    
    try {
      setIsProcessing(true);
      const response = await axios.post(`http://localhost:5000/api/tour-history/cancel/${selectedTicket.ID}`);
      
      if (response.data.message) {
        alert('Hủy vé thành công');
        // Refresh lại danh sách vé
        fetchTourHistory();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi hủy vé';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const openReviewDialog = (tour) => {
    setSelectedTourForReview(tour);
    setIsReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setSelectedTourForReview(null);
  };

  const handleSubmitReview = async (tourId, rating, content) => {
    try {
      const userId = sessionStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const reviewData = {
        tourId: selectedTourForReview.IDTOUR,
        userId,
        rating,
        content
      };

      console.log('Sending review data:', reviewData);

      const response = await axios.post('http://localhost:5000/add-review', reviewData);
      
      console.log('Review submission response:', response.data);
      alert('Đánh giá đã được gửi thành công!');
      closeReviewDialog();
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Full error response:', error.response);
      console.error('Lỗi từ server:', error.response?.data);
      alert(`Không thể gửi đánh giá: ${error.response?.data?.error || error.message}`);
    }
  };

  const canReview = (ticket) => {
    // Kiểm tra điều kiện đánh giá
    if (ticket.TINHTRANG !== 'Đã thanh toán') {
      return false;
    }

    // Kiểm tra ngày kết thúc tour
    const tourEndDate = new Date(ticket.NGAYVE);
    const now = new Date();
    return tourEndDate < now;
  };

  const getTicketStatus = (ticket) => {
    switch (ticket.TINHTRANG) {
      case 'Đã hủy':
        return 'Đã hủy';
      case 'Chưa thanh toán':
        return 'Chưa thanh toán';
      default:
        const departureDate = new Date(ticket.NGAYDI);
        const now = new Date();
        
        if (now > departureDate) {
          return 'Tour đã diễn ra';
        }
        
        const hoursDifference = (departureDate - now) / (1000 * 60 * 60);
        if (hoursDifference <= 24) {
          return 'Không thể hủy (dưới 24h trước tour)';
        }
        
        return ticket.TINHTRANG;
    }
  };

  return (
    <div className="tour-history-container">
      <h1 className="tour-history-title">Lịch sử đặt tour</h1>
      <table className="tour-history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày đặt</th>
            <th>Tổng số vé</th>
            <th>Tình trạng</th>
            <th>Tổng tiền</th>
            <th className="payment-method">Phương thức thanh toán</th>
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
                <td>{getTicketStatus(item)}</td>
                <td>{formatCurrency(item.TONGTIEN)}</td>
                <td>{item.PHUONGTHUCTHANHTOAN}</td>
                <td>
                  <div className="button-group">
                    <button 
                      className="view-details-link" 
                      onClick={() => openDetailsDialog(item)}
                    >
                      Xem chi tiết
                    </button>
                    {canReview(item) ? (
                      <button 
                        className="review-button"
                        onClick={() => openReviewDialog(item)}
                      >
                        Đánh giá
                      </button>
                    ) : (
                      <button 
                        className="review-button" 
                        disabled 
                        title={
                          item.TINHTRANG !== 'Đã thanh toán' 
                            ? 'Vé chưa được thanh toán'
                            : 'Tour chưa kết thúc'
                        }
                      >
                        Chưa thể đánh giá
                      </button>
                    )}

                    {item.TINHTRANG === 'Đã hủy' ? (
                      <button className="cancel-button" disabled>
                        Đã hủy
                      </button>
                    ) : item.TINHTRANG === 'Chưa thanh toán' ? (
                      <button className="cancel-button" disabled>
                        Chưa thanh toán
                      </button>
                    ) : new Date() > new Date(item.NGAYDI) ? (
                      <button className="cancel-button" disabled>
                        Tour đã diễn ra
                      </button>
                    ) : (
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
              <td colSpan="7" className="no-tours">Không có tour nào trong lịch sử.</td>
            </tr>
          )}
        </tbody>
      </table>

      <CancelDialog
        isOpen={isDialogOpen}
        onClose={closeCancelDialog}
        onConfirm={handleCancelTicket}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        isProcessing={isProcessing}
      />

      <TicketDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        ticket={selectedTicket}
      />

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={closeReviewDialog}
        onSubmit={handleSubmitReview}
        tour={selectedTourForReview}
      />
    </div>
  );
};

export default TourHistory;
