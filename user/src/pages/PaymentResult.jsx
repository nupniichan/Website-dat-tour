import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pagesName from '../Router/PagesNames'
const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy các tham số từ URL (query parameters)
    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode'); // Lấy resultCode từ URL
    const message = params.get('message'); // Lấy thông báo từ URL nếu có

    // Kiểm tra trạng thái giao dịch dựa trên resultCode
    if (resultCode === '0') {
      // Nếu resultCode = 0, giao dịch thành công
      alert('Thanh toán thành công!');
      navigate(`${pagesName.PAYMENTSUCCESS}`); // Điều hướng đến trang thành công
    } else {
      // Nếu resultCode khác 0, giao dịch thất bại
      alert(`Thanh toán thất bại: ${message}`);
      navigate(`${pagesName.PAYMENTFAILED}`); // Điều hướng đến trang thất bại
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Đang xử lý kết quả thanh toán...</h1>
    </div>
  );
};

export default PaymentResult;