import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy tham số từ URL (query parameters)
    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode'); // Lấy resultCode từ URL
    const message = params.get('message'); // Lấy thông báo từ URL nếu có

    // Kiểm tra trạng thái giao dịch
    if (resultCode === '0') {
      // Giao dịch thành công
      alert('Thanh toán thành công!');
      // Thực hiện các hành động cần thiết nếu cần
      navigate('/payment-success'); // Điều hướng đến trang thành công
    } else {
      // Giao dịch thất bại
      alert('Thanh toán thất bại: ' + message);
      navigate('/payment-failed'); // Điều hướng đến trang thất bại
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Đang xử lý kết quả thanh toán...</h1>
    </div>
  );
};

export default PaymentResult;
