import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {message, notification} from 'antd'

const Checkout = () => {
    const { id } = useParams(); // Lấy tourId từ URL params
    const [tourDetails, setTourDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [promoCode, setPromoCode] = useState(""); // Mã giảm giá
    const [finalPrice, setFinalPrice] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [customerNote, setCustomerNote] = useState("");
    const [customerInfo, setCustomerInfo] = useState({
        fullname: "",
        phoneNumber: "",
        email: "",
        address: "",
    });

    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [infantCount, setInfantCount] = useState(0);

    // Lấy id và customerId từ sessionStorage
    const customerId = sessionStorage.getItem("userId");

    // Thêm states mới
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [promoList, setPromoList] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState(null);

    // Thêm states mới để quản lý phân trang
    const [displayedPromos, setDisplayedPromos] = useState([]);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchTourDetails(id);
        fetchCustomerInfo(customerId);
    }, [id, customerId]);

    // Thêm useEffect để fetch danh sách mã giảm giá
    useEffect(() => {
        fetchActivePromotions();
    }, []);

    // Cập nhật useEffect để xử lý phân trang ban đầu
    useEffect(() => {
        if (promoList.length > 0) {
            setDisplayedPromos(promoList.slice(0, ITEMS_PER_PAGE));
        }
    }, [promoList]);

    const fetchTourDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/tours/${id}`);
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
            }
            const data = await response.json();
            setTourDetails(data);
            setLoading(false);
        } catch (error) {
            setError("Không thể lấy thông tin tour: " + error.message);
            setLoading(false);
        }
    };

    const fetchCustomerInfo = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/user/${id}`);
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
            }
            const data = await response.json();
            setCustomerInfo({
                fullname: data.FULLNAME,
                phoneNumber: data.PHONENUMBER,
                email: data.EMAIL,
                address: data.ADDRESS,
            });
        } catch (error) {
            setError("Không thể lấy thông tin khách hàng: " + error.message);
        }
    };

    // Sửa lại function để fetch mã giảm giá còn hiệu lực
    const fetchActivePromotions = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/discount-codes"
            );
            if (!response.ok) throw new Error("Failed to fetch promotions");
            const data = await response.json();

            // Format lại data và thêm trạng thái
            const formattedData = data.map((promo) => ({
                id: promo.IDMAGIAMGIA,
                code: promo.TENMGG,
                condition: promo.DIEUKIEN,
                discount_value: promo.TILECHIETKHAU,
                start_date: promo.NGAYAPDUNG,
                end_date: promo.NGAYHETHAN,
                status: promo.TRANGTHAI, // Thêm trạng thái
            }));

            // Lọc các mã còn hiệu lực và có trạng thái active
            const currentDate = new Date();
            const activePromos = formattedData.filter((promo) => {
                const endDate = new Date(promo.end_date);
                const startDate = new Date(promo.start_date);
                return (
                    currentDate >= startDate &&
                    currentDate <= endDate &&
                    promo.status !== "Hết hiệu lực"
                ); // Kiểm tra thêm trạng thái
            });

            // Sắp xếp theo giá trị giảm giá từ cao đến thấp
            const sortedPromos = activePromos.sort(
                (a, b) => b.discount_value - a.discount_value
            );

            setPromoList(sortedPromos);
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    };

    useEffect(() => {
        if (tourDetails?.GIA) {
            const totalPrice =
                tourDetails.GIA * adultCount +
                tourDetails.GIA * 0.8 * childCount +
                tourDetails.GIA * 0.5 * infantCount;
            setFinalPrice(totalPrice);
            console.log("Tổng giá mới (real-time):", totalPrice);
        }
    }, [adultCount, childCount, infantCount, tourDetails]);

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value); // Cập nhật mã giảm giá khi nhập
    };

    // Sửa lại hàm applyPromoCode để thêm validate
    const applyPromoCode = async () => {
        // if (!selectedPromo) {
        //     alert("Vui lòng chọn mã giảm giá!");
        //     return;
        // }

        try {
            // Kiểm tra trạng thái
            if (selectedPromo.status === "Hết hiệu lực") {
                notification.error({
                    message: "Lỗi khi áp dụng voucher",
                    description: "Voucher này đã hết hiệu lực!",
                })
                return;
            }

            // Kiểm tra thời hạn
            const currentDate = new Date();
            const startDate = new Date(selectedPromo.start_date);
            const endDate = new Date(selectedPromo.end_date);

            if (currentDate < startDate) {
                notification.error({
                    message: "Lỗi khi áp dụng voucher",
                    description: "Mã giảm giá chưa đến thời gian áp dụng!",
                })
                return;
            }

            if (currentDate > endDate) {
                notification.error({
                    message: "Lỗi khi áp dụng voucher",
                    description: "Mã giảm giá đã hết hạn sử dụng!",
                })
                return;
            }

            // Tính toán giá sau khi giảm
            const discountAmount =
                (finalPrice * selectedPromo.discount_value) / 100;
            const newPrice = finalPrice - discountAmount;

            setFinalPrice(newPrice);
            notification.success({
                message: "Áp dụng mã giảm giá thành công!",
                description: `Bạn được giảm ${selectedPromo.discount_value}%`,
            })
        } catch (error) {
            console.error("Error applying promotion:", error);
            notification.error({
                message: "Lỗi khi áp dụng voucher",
                description: "Có lỗi xảy ra khi áp dụng voucher",
            })
        }
    };

    const incrementAdults = () => {
        setAdultCount(adultCount + 1);
    };

    const decrementAdults = () => {
        setAdultCount(adultCount > 1 ? adultCount - 1 : 1);
    };

    const incrementChildren = () => {
        setChildCount(childCount + 1);
    };

    const decrementChildren = () => {
        setChildCount(childCount > 0 ? childCount - 1 : 0);
    };

    const incrementInfants = () => {
        setInfantCount(infantCount + 1);
    };

    const decrementInfants = () => {
        setInfantCount(infantCount > 0 ? infantCount - 1 : 0);
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCustomerNoteChange = (e) => {
        setCustomerNote(e.target.value);
    };

    const handlePayment = async () => {
        if (!termsAccepted) {
            message.warning({content: "Bạn cần đồng ý với các điều khoản trước khi tiếp tục!"})
            return;
        }

        if (!paymentMethod) {
            message.warning({content: "Vui lòng chọn một phương thức thanh toán"});
            return;
        }

        const paymentData = {
            tourId: id,
            customerId: customerId,
            amount: finalPrice,
            adultCount: adultCount,
            childCount: childCount,
            infantCount: infantCount,
            paymentMethod: paymentMethod,
            ticketType: tourDetails.LOAITOUR,
            customerNote: customerNote || "",
            bookingDate: new Date().toISOString(),
            status:
                paymentMethod === "Tiền mặt"
                    ? "Chưa thanh toán"
                    : "Đã thanh toán",
            totalTickets: adultCount + childCount + infantCount,
            discountId: selectedPromo?.id || null,
        };

        try {
            if (paymentMethod === "Tiền mặt") {
                // Xử lý thanh toán tiền mặt
                const response = await fetch(
                    "http://localhost:5000/add-ticket",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            IDTOUR: paymentData.tourId,
                            IDNGUOIDUNG: paymentData.customerId,
                            TONGTIEN: paymentData.amount,
                            PHUONGTHUCTHANHTOAN: paymentData.paymentMethod,
                            SOVE_NGUOILON: paymentData.adultCount,
                            SOVE_TREM: paymentData.childCount,
                            SOVE_EMBE: paymentData.infantCount,
                            GHICHU: paymentData.customerNote,
                            TINHTRANG: paymentData.status,
                            NGAYDAT: paymentData.bookingDate,
                            LOAIVE: paymentData.ticketType,
                            IDMAGIAMGIA: paymentData.discountId,
                        }),
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    window.location.href = `/booking-success?ticketId=${result.ticketId}&paymentMethod=Tiền mặt`;
                }
            } else if (paymentMethod === "momo") {
                // Xử lý thanh toán MoMo (giữ nguyên code cũ)
                const momoResponse = await fetch(
                    "http://localhost:5000/payment",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            amount: finalPrice,
                            orderInfo: `Thanh toán tour ${tourDetails.TENTOUR}`,
                            extraData: JSON.stringify(paymentData),
                        }),
                    }
                );

                const data = await momoResponse.json();
                if (data.payUrl) {
                    window.location.href = data.payUrl;
                }
            }
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            notification.error({
                message: "Lỗi thanh toán",
                description: "Có lỗi xảy ra trong quá trình thanh toán",
            })
        }
    };

    // Thêm function để xóa mã giảm giá
    const removePromoCode = () => {
        if (selectedPromo) {
            // Khôi phục lại giá ban đầu
            const originalPrice =
                tourDetails.GIA * adultCount +
                tourDetails.GIA * 0.8 * childCount +
                tourDetails.GIA * 0.5 * infantCount;
            setFinalPrice(originalPrice);
            setSelectedPromo(null);
            setPromoCode("");
            // alert("Đã xóa mã giảm giá");
        }
    };

    // Thêm function để xử lý infinite scroll
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        // Khi người dùng kéo gần đến cuối danh sách
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            const nextPage = page + 1;
            const start = (nextPage - 1) * ITEMS_PER_PAGE;
            const end = nextPage * ITEMS_PER_PAGE;

            // Kiểm tra xem còn mã giảm giá để hiển thị không
            if (start < promoList.length) {
                setDisplayedPromos([
                    ...displayedPromos,
                    ...promoList.slice(start, end),
                ]);
                setPage(nextPage);
            }
        }
    };

    if (loading) return <div className="text-center">Đang tải...</div>;
    if (error)
        return <div className="text-red-500 text-center">Lỗi: {error}</div>;
    if (!tourDetails)
        return <div className="text-center">Không có thông tin tour.</div>;

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return date.toLocaleDateString("vi-VN", options);
    }

    // Cập nhật component Modal
    const PromoModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Chọn mã giảm giá</h3>
                    <button
                        onClick={() => setShowPromoModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Thêm lưu ý ở đầu modal */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">Hướng dẫn sử dụng:</p>
                    <ul className="list-disc list-inside">
                        <li>Chọn mã giảm giá mà bạn mong muốn</li>
                        <li>
                            Bấm vào mã để chọn, sau đó nhấn "Áp dụng" để giảm
                            giá
                        </li>
                        <li>
                            Mã có tỷ lệ giảm giá cao hơn được hiển thị đầu tiên
                        </li>
                    </ul>
                </div>

                {/* Thêm container có scroll riêng cho danh sách mã */}
                <div
                    className="overflow-y-auto max-h-[50vh] space-y-4 pr-2"
                    onScroll={handleScroll}
                >
                    {displayedPromos.length > 0 ? (
                        <>
                            {displayedPromos.map((promo) => (
                                <div
                                    key={promo.id}
                                    onClick={() => {
                                        if (promo.status === "Hết hiệu lực") {
                                            notification.error({
                                                message: "Lỗi khi áp dụng voucher",
                                                description: "Voucher này đã hết hiệu lực!"
                                            })
                                            return;
                                        }
                                        setSelectedPromo(promo);
                                        setPromoCode(promo.code);
                                        setShowPromoModal(false);
                                    }}
                                    className={`p-4 border rounded-lg transition
                    ${
                        promo.status === "Hết hiệu lực"
                            ? "bg-gray-100 cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:bg-gray-50"
                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">
                                                {promo.code}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {promo.condition}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                HSD:{" "}
                                                {new Date(
                                                    promo.end_date
                                                ).toLocaleDateString("vi-VN")}
                                            </p>
                                            {promo.status ===
                                                "Hết hiệu lực" && (
                                                <span className="text-xs text-red-500 font-medium">
                                                    Đã hết hiệu lực
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-red-500 font-bold">
                                            -{promo.discount_value}%
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Hiển thị loading khi đang tải thêm */}
                            {displayedPromos.length < promoList.length && (
                                <div className="text-center py-2 text-gray-500">
                                    Kéo xuống để xem thêm...
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">
                            Không có mã giảm giá nào khả dụng
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6 mb-20">
            {/* Tóm tắt chuyến đi */}
            <div className="col-span-12 md:col-span-4 bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Tóm tắt chuyến đi</h3>
                <img
                    src={`http://localhost:5000/${tourDetails.HINHANH}`}
                    alt="Tour"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-lg font-semibold">
                    Tên tour: {tourDetails.TENTOUR}
                </p>
                <p className="text-gray-700">
                    Địa điểm khởi hành: {tourDetails.KHOIHANH}
                </p>
                <p className="text-gray-700">
                    Ngày đi:{" "}
                    {tourDetails.NGAYDI
                        ? formatDate(tourDetails.NGAYDI)
                        : "N/A"}{" "}
                    - Ngày về:{" "}
                    {tourDetails.NGAYVE
                        ? formatDate(tourDetails.NGAYVE)
                        : "N/A"}
                </p>
                <div className="mt-4">
                    <p className="font-medium">
                        Khách hàng: {adultCount} người lớn, {childCount} trẻ em,{" "}
                        {infantCount} em bé
                    </p>
                </div>

                <div className="mt-6">
                    <label className="block font-medium mb-2">
                        Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md flex-1 p-2"
                            placeholder="Chọn mã giảm giá"
                            value={promoCode}
                            readOnly
                        />
                        <button
                            onClick={() => setShowPromoModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Chọn
                        </button>
                    </div>

                    {/* Thêm lưu ý về mã giảm giá */}
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Lưu ý:</p>
                        <ul className="list-disc list-inside">
                            <li>
                                Mỗi lần thanh toán bạn chỉ được áp dụng 1 mã
                                giảm giá
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={applyPromoCode}
                            className={`flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition
                ${!selectedPromo ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={!selectedPromo}
                        >
                            Áp dụng
                        </button>
                        {selectedPromo && (
                            <button
                                onClick={removePromoCode}
                                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                            >
                                Xóa mã
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-2xl font-semibold text-red-500">
                        Tổng tiền: {finalPrice.toLocaleString()} VND
                    </p>
                </div>
                <button
                    className={`mt-4 w-full bg-green-600 text-white py-2 rounded-lg ${
                        !termsAccepted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!termsAccepted}
                    onClick={handlePayment}
                >
                    Tiếp tục thanh toán
                </button>
            </div>

            {/* Hiển thị thông tin khách hàng */}
            <div className="col-span-12 md:col-span-8 bg-white shadow-lg rounded-lg p-6">
                <h4 className="text-2xl font-bold mb-4">
                    Thông tin hành khách
                </h4>

                {/* Thông tin liên lạc */}
                <h4 className="text-xl font-semibold mb-4">
                    Thông tin liên lạc
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Object.entries(customerInfo).map(([key, value]) => (
                        <div key={key}>
                            <label className="block font-medium">
                                {key === "fullname"
                                    ? "Họ tên"
                                    : key === "phoneNumber"
                                    ? "Số điện thoại"
                                    : key === "email"
                                    ? "Email"
                                    : "Địa chỉ"}
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-md w-full p-2 mt-2"
                                value={value}
                                readOnly
                                onClick={(e) => {
                                    e.preventDefault();
                                    message.error({content: "Bạn không thể thay đổi thông tin này!"})
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Thông tin giá vé */}
                <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4">Thông tin vé</h4>
                    {[
                        {
                            label: "Người lớn",
                            count: adultCount,
                            increment: incrementAdults,
                            decrement: decrementAdults,
                        },
                        {
                            label: "Trẻ em",
                            count: childCount,
                            increment: incrementChildren,
                            decrement: decrementChildren,
                        },
                        {
                            label: "Em bé",
                            count: infantCount,
                            increment: incrementInfants,
                            decrement: decrementInfants,
                        },
                    ].map(({ label, count, increment, decrement }, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between mb-4 border border-gray-300 p-4 rounded-md"
                        >
                            <span>{label}</span>
                            <div>
                                <button
                                    onClick={decrement}
                                    className="border p-2"
                                >
                                    -
                                </button>
                                <span className="px-4">{count}</span>
                                <button
                                    onClick={increment}
                                    className="border p-2"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Phương thức thanh toán */}
                <h4 className="text-xl font-semibold mt-8 mb-4">
                    Hình thức thanh toán
                </h4>
                <div className="mb-6">
                    <label className="block font-medium">
                        Chọn hình thức thanh toán
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={handlePaymentChange}
                        className="border border-gray-300 rounded-md w-full p-2 mt-2"
                    >
                        <option value="" disabled>
                            Chọn phương thức
                        </option>
                        <option value="Tiền mặt">Tiền mặt</option>
                        <option value="vnPay">Quét mã VNPay</option>
                        <option value="momo">Thanh toán bằng Momo</option>
                    </select>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                    Lưu ý: Vui lòng chọn phương thức thanh toán phù hợp. Bạn sẽ
                    được chuyển hướng đến trang thanh toán tương ứng.
                </p>

                {/* Ghi chú khách hàng */}
                <h4 className="text-xl font-semibold mt-8 mb-4">Ghi chú</h4>
                <textarea
                    value={customerNote}
                    onChange={handleCustomerNoteChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                    placeholder="Nhập ghi chú của bạn"
                    rows={4}
                />

                {/* Điều khoản và dịch vụ */}
                <h4 className="text-xl font-semibold mt-8 mb-4">
                    Điều khoản và dịch vụ khi đặt tour
                </h4>
                <div className="h-96 overflow-y-auto border border-gray-300 p-4 rounded-md mb-4 bg-gray-50">
                    <div className="space-y-6 w-auto mx-auto">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-bold text-lg text-blue-700 mb-3">
                                1. Quy định về độ tuổi và giá vé:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    <span className="font-medium">
                                        Người lớn (từ 18 tuổi trở lên):
                                    </span>{" "}
                                    100% giá tour
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>Yêu cầu CMND/CCCD khi đi tour</li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="font-medium">
                                        Học sinh (từ 12-17 tuổi):
                                    </span>{" "}
                                    100% giá tour
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>Yêu cầu CMND/CCCD khi đi tour</li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="font-medium">
                                        Trẻ em (từ 5-11 tuổi):
                                    </span>{" "}
                                    80% giá tour người lớn
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>
                                            Được hưởng quyền lợi đầy đủ ghế
                                            ngồi, suất ăn, vé tham quan như
                                            người lớn
                                        </li>
                                        <li>
                                            Yêu cầu xuất trình được để chứng
                                            minh tuổi
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="font-medium">
                                        Em bé (từ 0-4 tuổi):
                                    </span>{" "}
                                    50% giá tour người lớn
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>
                                            Được hưởng quyền lợi đầy đủ ghế
                                            ngồi, suất ăn, vé tham quan như
                                            người lớn
                                        </li>
                                        <li>
                                            Yêu cầu xuất trình được để chứng
                                            minh tuổi
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-bold text-lg text-blue-700 mb-3">
                                2. Quy định thanh toán:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    <span className="font-medium">
                                        Phương thức thanh toán:
                                    </span>
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>Thanh toán qua ví điện tử MoMo</li>
                                        <li>Thanh toán qua VNPay</li>
                                        <li>
                                            Thanh toán tiền mặt tại văn phòng
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="font-medium">
                                        Thời hạn thanh toán:
                                    </span>
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>
                                            Thanh toán 100% trong vòng 24 giờ
                                            sau khi đặt tour online
                                        </li>
                                        <li>
                                            Vé sẽ bị huỷ nếu không thanh toán
                                            đúng hạn
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-bold text-lg text-blue-700 mb-3">
                                3. Chính sách hủy tour:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    Trước 7 ngày: Hoàn 80% tổng giá trị tour
                                </li>
                                <li>Từ 3-6 ngày: Hoàn 50% tổng giá trị tour</li>
                                <li>Dưới 24h: Không hoàn tiền</li>
                                <li>
                                    Các trường hợp bất khả kháng sẽ được xem xét
                                    riêng
                                </li>
                                <li>
                                    Khi huỷ tour, sẽ có nhân viên liên hệ với
                                    bạn thông qua số điện thoại để hỗ trợ hoàn
                                    tiền
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-bold text-lg text-blue-700 mb-3">
                                4. Quyền lợi khách hàng:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Được tư vấn và hỗ trợ 24/7</li>
                                <li>Được bảo hiểm du lịch theo quy định</li>
                                <li>
                                    Được đổi ngày khởi hành trước 7 ngày (nếu
                                    còn chỗ)
                                </li>
                                <li>
                                    Được hoàn tiền nếu tour bị hủy từ phía công
                                    ty
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-bold text-lg text-blue-700 mb-3">
                                5. Lưu ý quan trọng:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    Giá tour không bao gồm:
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>Chi phí cá nhân, đồ uống</li>
                                        <li>
                                            Tiền tip cho hướng dẫn viên và tài
                                            xế
                                        </li>
                                        <li>
                                            Chi phí phát sinh ngoài chương trình
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Yêu cầu giấy tờ:
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>CMND/CCCD với người lớn</li>
                                        <li>Giấy khai sinh với trẻ em</li>
                                    </ul>
                                </li>
                                <li>
                                    Quy định chung:
                                    <ul className="list-circle pl-6 mt-1 text-sm">
                                        <li>Tuân thủ giờ giấc và lịch trình</li>
                                        <li>Tôn trọng văn hóa địa phương</li>
                                        <li>Bảo vệ môi trường du lịch</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <label className="flex items-center mb-4">
                    <input type="checkbox" onChange={handleTermsChange} />{" "}
                    <span className="ml-2">Tôi đồng ý với các điều khoản</span>
                </label>
            </div>

            {/* Thêm Modal vào cuối component */}
            {showPromoModal && <PromoModal />}
        </div>
    );
};

export default Checkout;
