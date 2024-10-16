import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams(); // Lấy tourId từ URL params
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [customerNote, setCustomerNote] = useState(''); 
  const [customerInfo, setCustomerInfo] = useState({
    fullname: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);

  // Lấy id và customerId từ sessionStorage
  const customerId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchTourDetails(id);
    fetchCustomerInfo(customerId);
  }, [id]);

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
      setError('Không thể lấy thông tin tour: ' + error.message);
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
      setError('Không thể lấy thông tin khách hàng: ' + error.message);
    }
  };

  useEffect(() => {
    if (tourDetails?.GIA) {
      const totalPrice = tourDetails.GIA * adultCount + 
                         tourDetails.GIA * 0.8 * childCount + 
                         tourDetails.GIA * 0.5 * infantCount;
      setFinalPrice(totalPrice);
      console.log("Tổng giá mới (real-time):", totalPrice);
    }
  }, [adultCount, childCount, infantCount, tourDetails]);

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  // Áp dụng mã giảm giá - Test tạm thời
  const applyPromoCode = () => {
    if (promoCode === 'DISCOUNT10' && tourDetails) {
      setFinalPrice(prevPrice => prevPrice * 0.9); 
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
      alert('Bạn cần đồng ý với các điều khoản trước khi tiếp tục!');
      return;
    }
  
    const paymentData = {
      id: id,
      customerId: customerId,
      amount: finalPrice,
      adultCount: adultCount,
      childCount: childCount,
      infantCount: infantCount,
      paymentMethod: paymentMethod,
      ticketType: tourDetails.LOAITOUR,
      customerNote: customerNote || '',
    };
  
    try {
      const momoResponse = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice,
          orderInfo: `Thanh toán cho tour ${tourDetails.TENTOUR}`,
          extraData: JSON.stringify(paymentData), 
        }),
      });
  
      const data = await momoResponse.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
    }
  };  

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  if (!tourDetails) return <div className="text-center">Không có thông tin tour.</div>;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6">
      {/* Tóm tắt chuyến đi */}
      <div className="col-span-12 md:col-span-4 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Tóm tắt chuyến đi</h3>
        <img src={`http://localhost:5000/${tourDetails.HINHANH}`} alt="Tour" className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="text-lg font-semibold">Tên tour: {tourDetails.TENTOUR}</p>
        <p className="text-gray-700">Địa điểm khởi hành: {tourDetails.KHOIHANH}</p>
        <p className="text-gray-700">
          Ngày đi: {tourDetails.NGAYDI ? formatDate(tourDetails.NGAYDI) : 'N/A'} - 
          Ngày về: {tourDetails.NGAYVE ? formatDate(tourDetails.NGAYVE) : 'N/A'}
        </p>
        <div className="mt-4">
          <p className="font-medium">Khách hàng: {adultCount} người lớn, {childCount} trẻ em, {infantCount} em bé</p>
        </div>
        <div className="mt-6">
          <label className="block font-medium">Mã giảm giá</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            placeholder="Nhập mã giảm giá"
            value={promoCode}
            onChange={handlePromoCodeChange}
            disabled
          />
          <button onClick={applyPromoCode} className="mt-2 w-full bg-blue-600 text-white py-2 rounded opacity-50 cursor-not-allowed" disabled>Áp dụng</button>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-semibold text-red-500">Tổng tiền: {finalPrice.toLocaleString()} VND</p>
        </div>
        <button
          className={`mt-4 w-full bg-green-600 text-white py-2 rounded-lg ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!termsAccepted}
          onClick={handlePayment}
        >
          Tiếp tục thanh toán
        </button>
      </div>

      {/* Hiển thị thông tin khách hàng */}
      <div className="col-span-12 md:col-span-8 bg-white shadow-lg rounded-lg p-6">
        <h4 className="text-2xl font-bold mb-4">Thông tin hành khách</h4>

        {/* Thông tin liên lạc */}
        <h4 className="text-xl font-semibold mb-4">Thông tin liên lạc</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(customerInfo).map(([key, value]) => (
            <div key={key}>
              <label className="block font-medium">{key === 'fullname' ? 'Họ tên' : key === 'phoneNumber' ? 'Số điện thoại' : key === 'email' ? 'Email' : 'Địa chỉ'}</label>
              <input 
                type="text" 
                className="border border-gray-300 rounded-md w-full p-2 mt-2" 
                value={value} 
                readOnly 
              />
            </div>
          ))}
        </div>

        {/* Thông tin giá vé */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4">Thông tin vé</h4>
          {[{ label: 'Người lớn', count: adultCount, increment: incrementAdults, decrement: decrementAdults },
            { label: 'Trẻ em', count: childCount, increment: incrementChildren, decrement: decrementChildren },
            { label: 'Em bé', count: infantCount, increment: incrementInfants, decrement: decrementInfants }].map(({ label, count, increment, decrement }, index) => (
            <div key={index} className="flex items-center justify-between mb-4 border border-gray-300 p-4 rounded-md">
              <span>{label}</span>
              <div>
                <button onClick={decrement} className="border p-2">-</button>
                <span className="px-4">{count}</span>
                <button onClick={increment} className="border p-2">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Phương thức thanh toán */}
        <h4 className="text-xl font-semibold mt-8 mb-4">Hình thức thanh toán</h4>
        <div className="mb-6">
          <label className="block font-medium">Chọn hình thức thanh toán</label>
          <select 
            value={paymentMethod} 
            onChange={handlePaymentChange} 
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
          >
            <option value="" disabled>Chọn phương thức</option>
            <option value="cash">Tiền mặt</option>
            <option value="bank_transfer">Chuyển khoản</option>
            <option value="momo">Thanh toán bằng Momo</option>
          </select>
        </div>

        <p className="text-gray-600 text-sm mt-2">
          Lưu ý: Vui lòng chọn phương thức thanh toán phù hợp. Bạn sẽ được chuyển hướng đến trang thanh toán tương ứng.
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
        <h4 className="text-xl font-semibold mt-8 mb-4">Điều khoản bắt buộc khi đăng ký online</h4>
        <div className="h-32 overflow-y-scroll border border-gray-300 p-4 rounded-md mb-4">
          <p>Điều khoản sử dụng dịch vụ và các lưu ý khi thanh toán...</p>
        </div>

        <label className="flex items-center mb-4">
          <input type="checkbox" onChange={handleTermsChange} /> <span className="ml-2">Tôi đồng ý với các điều khoản</span>
        </label>
      </div>
    </div>
  );
};

export default Checkout;