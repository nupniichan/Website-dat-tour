import { useNavigate } from "react-router";
import pagesName from "../Router/PagesNames";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const handleNavigateToHomepage = () => {
    navigate(pagesName.HOMEPAGE)
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
      <p className="text-lg text-gray-700 mb-6">Giao dịch của bạn đã bị từ chối. Vui lòng thử lại.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleNavigateToHomepage}>
        Quay về trang chủ
      </button>
    </div>
  );
};

export default PaymentFailed;