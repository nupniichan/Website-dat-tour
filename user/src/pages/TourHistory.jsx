import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TourHistory.css";

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const CancelDialog = ({
    isOpen,
    onClose,
    onConfirm,
    cancelReason,
    setCancelReason,
    isProcessing,
}) => {
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
                    <option value="Thay đổi kế hoạch">Thay đổi kế hoạch</option>
                    <option value="Lý do cá nhân">Lý do cá nhân</option>
                </select>
                <div className="dialog-actions">
                    <button
                        className="dialog-confirm"
                        onClick={onConfirm}
                        disabled={isProcessing || !cancelReason} // Disable when processing or no reason selected
                    >
                        {isProcessing ? "Đang xử lý..." : "Xác nhận hủy vé"}
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
            <div
                className="ticket-details-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Chi tiết vé</h2>
                <p>
                    <strong>Mã vé:</strong> {ticket.ID}
                </p>
                <p>
                    <strong>Ngày đặt:</strong> {formatDate(ticket.NGAYDAT)}
                </p>
                <p>
                    <strong>Tổng số vé:</strong> {ticket.SOVE}
                </p>
                <p>
                    <strong>Số vé người lớn:</strong> {ticket.SOVE_NGUOILON}
                </p>
                <p>
                    <strong>Số vé trẻ em:</strong> {ticket.SOVE_TREM}
                </p>
                <p>
                    <strong>Số vé em bé:</strong> {ticket.SOVE_EMBE}
                </p>
                <p>
                    <strong>Tình trạng:</strong> {ticket.TINHTRANG}
                </p>
                <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(ticket.TONGTIEN)}
                </p>
                <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {ticket.PHUONGTHUCTHANHTOAN}
                </p>
                <p>
                    <strong>Ghi chú:</strong>{" "}
                    {ticket.GHICHU || "Không có ghi chú"}
                </p>
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
    const [content, setContent] = useState("");

    if (!isOpen || !tour) return null;

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            alert("Vui lòng chọn số sao đánh giá.");
            return;
        }
        if (content.trim() === "") {
            alert("Vui lòng nhập nội dung đánh giá.");
            return;
        }
        onSubmit(tour.IDTOUR, rating, content);
    };

    return (
        <div className="dialog-overlay">
            <div className="review-dialog">
                <h2>Đánh giá tour</h2>
                <div className="tour-details">
                    <p>
                        <strong>Mã vé:</strong> {tour.ID}
                    </p>
                    <p>
                        <strong>Mã tour:</strong> {tour.IDTOUR}
                    </p>
                    <p>
                        <strong>Ngày đặt:</strong> {formatDate(tour.NGAYDAT)}
                    </p>
                    <p>
                        <strong>Tổng số vé:</strong> {tour.SOVE}
                    </p>
                    <p>
                        <strong>Số vé người lớn:</strong> {tour.SOVE_NGUOILON}
                    </p>
                    <p>
                        <strong>Số vé trẻ em:</strong> {tour.SOVE_TREM}
                    </p>
                    <p>
                        <strong>Số vé em bé:</strong> {tour.SOVE_EMBE}
                    </p>
                    <p>
                        <strong>Tình trạng:</strong> {tour.TINHTRANG}
                    </p>
                    <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {formatCurrency(tour.TONGTIEN)}
                    </p>
                    <p>
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {tour.PHUONGTHUCTHANHTOAN}
                    </p>
                    <p>
                        <strong>Ghi chú:</strong>{" "}
                        {tour.GHICHU || "Không có ghi chú"}
                    </p>
                </div>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? "active" : ""}`}
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

const ViewReviewDialog = ({ isOpen, onClose, review }) => {
    if (!isOpen || !review) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div
                className="ticket-details-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Chi tiết đánh giá</h2>
                <div className="review-details">
                    <p>
                        <strong>Số sao đánh giá:</strong>
                    </p>
                    <div className="star-rating-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${
                                    star <= review.SOSAO ? "active" : ""
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <p>
                        <strong>Nội dung đánh giá:</strong>
                    </p>
                    <p className="review-content">{review.NOIDUNG}</p>
                    <p>
                        <strong>Thời gian đánh giá:</strong>{" "}
                        {formatDate(review.THOIGIAN || new Date())}
                    </p>
                </div>
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
    const [cancelReason, setCancelReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [selectedTourForReview, setSelectedTourForReview] = useState(null);
    const [isViewReviewDialogOpen, setIsViewReviewDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const canCancelTicket = (ticket, tourDate) => {
        const departureDate = new Date(tourDate);
        const now = new Date();
        const hoursDifference = (departureDate - now) / (1000 * 60 * 60);
        return hoursDifference >= 24;
    };

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        console.log(userId);
        const fetchTourHistory = async () => {
            if (!userId) {
                console.error("User ID not found in session storage.");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/tour-history/${userId}`
                );

                // Fetch tour dates and review status for each ticket
                const ticketsWithDetails = await Promise.all(
                    response.data.map(async (ticket) => {
                        // Fetch tour details
                        const tourResponse = await axios.get(
                            `http://localhost:5000/api/tour/${ticket.IDTOUR}`
                        );

                        // Check if user has already reviewed this tour
                        const reviewResponse = await axios.get(
                            `http://localhost:5000/check-review`,
                            {
                                params: {
                                    userId: userId,
                                    tourId: ticket.IDTOUR,
                                },
                            }
                        );

                        return {
                            ...ticket,
                            NGAYDI: tourResponse.data.NGAYDI,
                            hasReviewed: reviewResponse.data.hasReviewed,
                            review: reviewResponse.data.review,
                        };
                    })
                );
                setTourHistory(ticketsWithDetails);
            } catch (error) {
                console.error("Error fetching tour history:", error);
                alert("Lỗi khi lấy lịch sử đặt tour.");
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
        setCancelReason("");
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
            alert("Vui lòng chọn lý do hủy.");
            return;
        }

        setIsProcessing(true);
        try {
            await axios.post(
                `http://localhost:5000/api/tour-history/cancel/${selectedTicket.ID}`,
                {
                    reason: cancelReason,
                }
            );
            alert(`Vé có ID ${selectedTicket.ID} đã được hủy.`);

            setTourHistory((prev) =>
                prev.map((item) =>
                    item.ID === selectedTicket.ID
                        ? { ...item, TINHTRANG: "Đã hủy" }
                        : item
                )
            );

            closeCancelDialog();
        } catch (error) {
            console.error("Error canceling ticket:", error);
            alert("Hủy vé thất bại.");
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
            const userId = sessionStorage.getItem("userId");

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            const reviewData = {
                tourId: selectedTourForReview.IDTOUR,
                userId,
                rating,
                content,
            };

            const response = await axios.post(
                "http://localhost:5000/add-review",
                reviewData
            );

            setTourHistory((prev) =>
                prev.map((item) =>
                    item.ID === selectedTourForReview.ID
                        ? {
                              ...item,
                              hasReviewed: true,
                              review: {
                                  SOSAO: rating,
                                  NOIDUNG: content,
                                  IDNGUOIDUNG: userId,
                              },
                          }
                        : item
                )
            );

            alert("Đánh giá đã được gửi thành công!");
            closeReviewDialog();
        } catch (error) {
            console.error("Error submitting review:", error);
            alert(
                `Không thể gửi đánh giá: ${
                    error.response?.data?.error || error.message
                }`
            );
        }
    };

    const canReview = (tourEndDate) => {
        // Tạm thời return true để luôn hiển thị nút đánh giá
        return true;
    };

    const getTicketStatus = (ticket) => {
        if (ticket.TINHTRANG === "Đã hủy") {
            return "Đã hủy";
        }
        return canCancelTicket(ticket, ticket.NGAYDI)
            ? ticket.TINHTRANG
            : "Không thể hủy vé";
    };

    const openViewReviewDialog = (tour) => {
        setSelectedReview(tour.review);
        setIsViewReviewDialogOpen(true);
    };

    const closeViewReviewDialog = () => {
        setIsViewReviewDialogOpen(false);
        setSelectedReview(null);
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
                        <th className="payment-method">
                            Phương thức thanh toán
                        </th>
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
                                            onClick={() =>
                                                openDetailsDialog(item)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button
                                            className="view-details-link"
                                            onClick={() =>
                                                item.hasReviewed
                                                    ? openViewReviewDialog(item)
                                                    : openReviewDialog(item)
                                            }
                                        >
                                            {item.hasReviewed
                                                ? "Xem đánh giá"
                                                : "Đánh giá"}
                                        </button>
                                        {item.TINHTRANG === "Đã hủy" ? (
                                            <button
                                                className="cancel-button"
                                                disabled
                                            >
                                                Đã hủy
                                            </button>
                                        ) : canCancelTicket(
                                              item,
                                              item.NGAYDI
                                          ) ? (
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    openCancelDialog(item)
                                                }
                                                disabled={isProcessing}
                                            >
                                                Hủy vé
                                            </button>
                                        ) : (
                                            <button
                                                className="cancel-button"
                                                disabled
                                            >
                                                Không thể hủy
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-tours">
                                Không có tour nào trong lịch sử.
                            </td>
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

            <ViewReviewDialog
                isOpen={isViewReviewDialogOpen}
                onClose={closeViewReviewDialog}
                review={selectedReview}
            />
        </div>
    );
};

export default TourHistory;
