import { useEffect, useState } from "react";
import axios from "axios";
import "./TourHistory.css";
import { message, notification, DatePicker, Input, Pagination } from "antd";
const { Search } = Input;

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

    const detailSections = [
        {
            title: "Thông tin vé",
            items: [
                { label: "Mã vé", value: ticket.ID },
                { label: "Ngày đặt", value: formatDate(ticket.NGAYDAT) },
                { label: "Tình trạng", value: ticket.TINHTRANG },
            ]
        },
        {
            title: "Chi tiết số lượng",
            items: [
                { label: "Tổng số vé", value: ticket.SOVE },
                { label: "Số vé người lớn", value: ticket.SOVE_NGUOILON },
                { label: "Số vé trẻ em", value: ticket.SOVE_TREM },
                { label: "Số vé em bé", value: ticket.SOVE_EMBE },
            ]
        },
        {
            title: "Thông tin thanh toán",
            items: [
                { label: "Tổng tiền", value: formatCurrency(ticket.TONGTIEN) },
                { label: "Phương thức thanh toán", value: ticket.PHUONGTHUCTHANHTOAN },
            ]
        },
        {
            title: "Ghi chú",
            items: [
                { label: "Nội dung", value: ticket.GHICHU || "Không có ghi chú" },
            ]
        }
    ];

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="ticket-details-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>Chi tiết vé</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                <div className="dialog-content scrollable">
                    {detailSections.map((section, index) => (
                        <div key={index} className="detail-section">
                            <h3>{section.title}</h3>
                            <div className="detail-grid">
                                {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="detail-item">
                                        <span className="detail-label">{item.label}:</span>
                                        <span className="detail-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dialog-footer">
                    <button className="dialog-button" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewDialog = ({ isOpen, onClose, onSubmit, tour }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [content, setContent] = useState("");

    if (!isOpen || !tour) return null;

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleStarHover = (hoveredValue) => {
        setHoveredRating(hoveredValue);
    };

    const handleMouseLeave = () => {
        setHoveredRating(0);
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="review-dialog" onClick={(e) => e.stopPropagation()}>
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
                <div 
                    className="star-rating"
                    onMouseLeave={handleMouseLeave}
                >
                    {[5, 4, 3, 2, 1].map((star) => (
                        <span
                            key={star}
                            className={`star ${
                                (hoveredRating || rating) >= star ? "active" : ""
                            }`}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
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
                    <button 
                        className="dialog-confirm" 
                        onClick={() => onSubmit(tour.IDTOUR, rating, content)}
                    >
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
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTicketId, setSearchTicketId] = useState('');
    const [filterDate, setFilterDate] = useState(null);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const itemsPerPage = 10;

    const canCancelTicket = (ticket, departureDate) => {
        if (!ticket || !departureDate) return false;
        
        // Cho phép hủy nếu vé chưa thanh toán
        if (ticket.TINHTRANG === "Chưa thanh toán") {
            return true;
        }

        // Kiểm tra các điều kiện khác cho vé đã thanh toán
        if (ticket.TINHTRANG === "Đã thanh toán" || ticket.TINHTRANG === "Đã xác nhận") {
            const departure = new Date(departureDate);
            const now = new Date();
            const hoursDifference = (departure - now) / (1000 * 60 * 60);
            return hoursDifference >= 24;
        }

        return false;
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
                        console.log(
                            "Tour Response for ID",
                            ticket.IDTOUR,
                            ":",
                            tourResponse.data
                        );

                        // Check if user has already reviewed this specific ticket
                        const reviewResponse = await axios.get(
                            `http://localhost:5000/check-review`,
                            {
                                params: {
                                    userId: userId,
                                    tourId: ticket.IDTOUR,
                                    ticketId: ticket.ID,
                                },
                            }
                        );

                        return {
                            ...ticket,
                            NGAYDI: tourResponse.data.NGAYDI,
                            NGAYVE: tourResponse.data.NGAYVE,
                            hasReviewed: reviewResponse.data.hasReviewed,
                            review: reviewResponse.data.review,
                        };
                    })
                );
                console.log("Tickets with details:", ticketsWithDetails);
                setTourHistory(ticketsWithDetails);
            } catch (error) {
                console.error("Error fetching tour history:", error);
                message.error({ content: "Lỗi truy xuất lịch sử đặt tour." });
            }
        };

        fetchTourHistory();
    }, []);

    useEffect(() => {
        let filtered = [...tourHistory];
        
        // Lọc theo ID vé
        if (searchTicketId) {
            filtered = filtered.filter(item => 
                item.ID.toString().toLowerCase().includes(searchTicketId.toLowerCase())
            );
        }

        // Lọc theo ngày
        if (filterDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.NGAYDAT).toDateString();
                const filterDateString = new Date(filterDate).toDateString();
                return itemDate === filterDateString;
            });
        }

        setFilteredHistory(filtered);
        setCurrentPage(1); // Reset về trang 1 khi filter
    }, [tourHistory, searchTicketId, filterDate]);

    // Tính toán dữ liệu cho trang hiện tại
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredHistory.slice(startIndex, endIndex);
    };

    // Thêm handlers
    const handleSearch = (value) => {
        setSearchTicketId(value);
    };

    const handleDateChange = (date) => {
        setFilterDate(date);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
            message.error({ content: "Vui lòng chọn lý do hủy." });
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
            notification.success({
                message: "Hủy vé thành công",
                description: `Vé có ID ${selectedTicket.ID} đã được hủy.`,
            });

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
            notification.error({
                message: "Hủy vé thất bại.",
                description: "Có lỗi xảy ra khi hủy vé",
            });
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
                ticketId: selectedTourForReview.ID,
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
                                  THOIGIAN: new Date().toISOString(),
                                  IDNGUOIDUNG: userId,
                                  IDVE: selectedTourForReview.ID,
                              },
                          }
                        : item
                )
            );

            message.success({ content: "Đánh giá đã được gửi thành công!" });
            closeReviewDialog();
        } catch (error) {
            console.error("Error submitting review:", error);
            notification.error({
                message: "Lỗi",
                description: `Không thể gửi đánh giá: ${
                    error.response?.data?.error || error.message
                }`,
            });
        }
    };

    const canReview = (ticket) => {
        if (!ticket.NGAYDI || !ticket.NGAYVE) {
            console.log("Không có ngày đi hoặc ngày về");
            return false;
        }

        const tourEndDate = new Date(ticket.NGAYVE);
        const now = new Date();

        // Đặt thời gian về cuối ngày để so sánh chính xác
        tourEndDate.setHours(23, 59, 59, 999);
        
        // Log chi tiết để debug
        console.log("Tour Details:", {
            tourId: ticket.IDTOUR,
            endDate: tourEndDate.toISOString(),
            currentDate: now.toISOString(),
            status: ticket.TINHTRANG,
            hasReviewed: ticket.hasReviewed,
            canReviewByDate: now > tourEndDate
        });

        return (
            // Kiểm tra trạng thái vé
            (ticket.TINHTRANG === "Đã thanh toán" || ticket.TINHTRANG === "Đã xác nhận") &&
            // Kiểm tra ngày hiện tại phải sau ngày kết thúc tour
            now > tourEndDate &&
            // Kiểm tra chưa đánh giá
            !ticket.hasReviewed &&
            // Kiểm tra không phải vé đã hoàn tiền hoặc hủy
            ticket.TINHTRANG !== "Đã hoàn tiền" &&
            ticket.TINHTRANG !== "Đã hủy"
        );
    };

    const openViewReviewDialog = async (tour) => {
        try {
            const userId = sessionStorage.getItem("userId");
            // Lấy chi tiết đánh giá từ server
            const response = await axios.get(
                "http://localhost:5000/get-review",
                {
                    params: {
                        userId: userId,
                        tourId: tour.IDTOUR,
                        ticketId: tour.ID,
                    },
                }
            );

            setSelectedReview(response.data);
            setIsViewReviewDialogOpen(true);
        } catch (error) {
            console.error("Error fetching review:", error);
            message.error({ content: "Không thể lấy thông tin đánh giá" });
        }
    };

    const closeViewReviewDialog = () => {
        setIsViewReviewDialogOpen(false);
        setSelectedReview(null);
    };

    // Cập nhật hàm getReviewMessage để hiển thị thông báo chi tiết hơn
    const getReviewMessage = (ticket) => {
        if (!ticket.NGAYDI || !ticket.NGAYVE)
            return "Không tìm thấy thông tin ngày tour";
        if (ticket.hasReviewed) 
            return "Bạn đã đánh giá tour này";
        if (ticket.TINHTRANG === "Đã hủy")
            return "Không thể đánh giá tour đã hủy";
        if (ticket.TINHTRANG === "Đã hoàn tiền")
            return "Không thể đánh giá tour đã hoàn tiền";
        if (ticket.TINHTRANG !== "Đã thanh toán" && ticket.TINHTRANG !== "Đã xác nhận")
            return "Chỉ có thể đánh giá tour đã thanh toán";

        const tourEndDate = new Date(ticket.NGAYVE);
        tourEndDate.setHours(23, 59, 59, 999);
        const now = new Date();

        if (now <= tourEndDate) {
            // Tính số ngày còn lại
            const remainingTime = tourEndDate.getTime() - now.getTime();
            const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
            
            if (remainingDays === 0) {
                return "Bạn có thể đánh giá tour từ ngày mai";
            } else {
                return `Chỉ có thể đánh giá sau khi tour kết thúc (còn ${remainingDays} ngày)`;
            }
        }

        return "";
    };

    return (
        <div className="tour-history-container">
            <h1 className="tour-history-title">Lịch sử đặt tour</h1>
            
            {/* Thêm phần filter */}
            <div className="filter-section" style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <Search
                    placeholder="Tìm theo ID vé"
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 200 }}
                />
                <DatePicker
                    placeholder="Lọc theo ngày đặt"
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    style={{ width: 200 }}
                />
            </div>

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
                    {getCurrentPageData().length > 0 ? (
                        getCurrentPageData().map((item) => (
                            <tr key={item.ID}>
                                <td>{item.ID}</td>
                                <td>{formatDate(item.NGAYDAT)}</td>
                                <td>{item.SOVE}</td>
                                <td>{item.TINHTRANG}</td>
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
                                            onClick={() => {
                                                if (
                                                    !canReview(item) &&
                                                    !item.hasReviewed
                                                ) {
                                                    alert(
                                                        getReviewMessage(item)
                                                    );
                                                    return;
                                                }
                                                item.hasReviewed
                                                    ? openViewReviewDialog(item)
                                                    : openReviewDialog(item);
                                            }}
                                            disabled={
                                                !canReview(item) &&
                                                !item.hasReviewed
                                            }
                                            style={{
                                                opacity:
                                                    !canReview(item) &&
                                                    !item.hasReviewed
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    !canReview(item) &&
                                                    !item.hasReviewed
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
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

            {/* Thêm phân trang */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    current={currentPage}
                    total={filteredHistory.length}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>

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
