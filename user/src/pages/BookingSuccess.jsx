import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const paymentMethod = searchParams.get('paymentMethod');

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Đặt tour thành công!
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600">Mã đặt tour của bạn: {ticketId}</p>
          </div>

          {paymentMethod === 'cash' ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Lưu ý quan trọng:</strong>
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Quý khách vui lòng thanh toán tour tại quầy trong vòng 24 giờ.
                    Sau 24 giờ không thanh toán, vé sẽ tự động bị hủy.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Thanh toán thành công! Cảm ơn quý khách đã đặt tour.
                  </p>
                </div>
              </div>
            </div>
          )}

          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess; 