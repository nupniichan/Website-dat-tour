import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Thêm useParams

const Checkout = () => {
  const { tourId } = useParams(); // Lấy tourId từ URL
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

  // Lấy customerId từ sessionStorage
  const customerId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchTourDetails(tourId); // Gọi API để lấy thông tin chi tiết tour
    fetchCustomerInfo(customerId); // Gọi API để lấy thông tin khách hàng
  }, [tourId]);

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
      tourId: tourId,
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

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6">
      {/* Nội dung checkout */}
      {/* ... */}
    </div>
  );
};

export default Checkout;
