import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { message } from 'antd';
import { TbPlaneArrival, TbPlaneDeparture, TbTrain } from "react-icons/tb";
import PagesNames from '../Router/PagesNames.js';

const SearchResults = () => {
    const userId = sessionStorage.getItem("userId");
    const location = useLocation();
    const navigate = useNavigate();
    const { results: initialResults } = location.state || {};
    const [filteredResults, setFilteredResults] = useState(initialResults || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage] = useState(5);
    const [transportation, setTransportation] = useState('');
    const [tourType, setTourType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterResults = useCallback(() => {
        const filtered = initialResults.filter(item => {
            const price = parseFloat(item.GIA);
            const isTransportationMatch = transportation ? item.PHUONGTIENDICHUYEN === transportation : true;
            const isTypeMatch = tourType ? item.LOAITOUR === tourType : true;
            const isStartDateMatch = startDate ? dayjs(item.NGAYDI).isSame(dayjs(startDate), 'day') : true;
            const isEndDateMatch = endDate ? dayjs(item.NGAYVE).isSame(dayjs(endDate), 'day') : true;
            const isMinPriceMatch = minPrice ? price >= parseFloat(minPrice) : true;
            const isMaxPriceMatch = maxPrice ? price <= parseFloat(maxPrice) : true;

            return isTransportationMatch && isTypeMatch && isStartDateMatch && isEndDateMatch && isMinPriceMatch && isMaxPriceMatch;
        });

        setFilteredResults(filtered);
    }, [initialResults, transportation, tourType, minPrice, maxPrice, startDate, endDate]);

    useEffect(() => {
        filterResults();
    }, [filterResults]);

    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredResults.slice(indexOfFirstTour, indexOfLastTour);

    const nextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredResults.length / toursPerPage)));
    const prevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

    const goToTourDetails = (tour) => {
        // route đang ko navigate được
        navigate(`${PagesNames.TOUR_DETAILS}/${tour.ID}/${tour.TENTOUR}`);
    };

    const goToCheckout = (tour) => {
        if (userId) {
            navigate(`${PagesNames.CHECKOUT}/${tour.ID}`);
        } else {
            message.warning({ content: 'Vui lòng đăng nhập' });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row p-5 lg:p-12 gap-5">
            {/* Filter Bar - Changes to horizontal on smaller screens */}
            <div className="lg:w-64 bg-gray-50 rounded-xl shadow-md p-6 lg:mb-12 mb-16">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="transportation" className="block text-sm font-medium text-gray-700">
                            Phương tiện:
                        </label>
                        <select
                            id="transportation"
                            value={transportation}
                            onChange={(e) => setTransportation(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        >
                            <option value="">Chọn phương tiện</option>
                            <option value="Xe Buýt">Xe Buýt</option>
                            <option value="Máy bay">Máy bay</option>
                            <option value="Thuyền">Thuyền</option>
                            <option value="Tàu hoả">Tàu hoả</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tourType" className="block text-sm font-medium text-gray-700">
                            Loại tour:
                        </label>
                        <select
                            id="tourType"
                            value={tourType}
                            onChange={(e) => setTourType(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        >
                            <option value="">Chọn loại tour</option>
                            <option value="Tour trong nước">Tour trong nước</option>
                            <option value="Tour quốc tế">Tour quốc tế</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Ngày đi:
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Ngày về:
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                            Giá tối thiểu:
                        </label>
                        <input
                            id="minPrice"
                            type="number"
                            placeholder="Giá tối thiểu"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                            Giá tối đa:
                        </label>
                        <input
                            id="maxPrice"
                            type="number"
                            placeholder="Giá tối đa"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
                        />
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 space-y-6 lg:mb-0 mb-16">
                {currentTours && currentTours.length > 0 ? (
                    currentTours.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => goToTourDetails(item)}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="md:flex">
                                <div className="relative md:w-48 lg:w-64">
                                    <img
                                        src={`http://localhost:5000/${item.HINHANH}`}
                                        alt={item.TENTOUR}
                                        className="w-full h-48 md:h-full object-cover"
                                        onError={(e) => e.target.src = 'default-image.jpg'}
                                    />
                                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                        {item.LOAITOUR}
                                    </div>
                                    {item.SOVE <= 10 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                            Còn {item.SOVE} vé!
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-6">
                                    <h3 className="text-xl font-bold mb-3">{item.TENTOUR}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:translate-x-0 translate-x-[0.9rem]">
                                        <div className="flex items-center text-gray-600 md:ml-[0.9rem]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span>Khởi hành: {item.KHOIHANH}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 -translate-x-[0.15rem]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{dayjs(item.NGAYVE).diff(dayjs(item.NGAYDI), 'day')} ngày {dayjs(item.NGAYVE).diff(dayjs(item.NGAYDI), 'day') - 1} đêm</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg> */}
                                            <TbPlaneDeparture className='h-5 w-5 mr-3 text-orange-500' />
                                            <div>
                                                <div className="text-sm text-gray-500">Ngày đi</div>
                                                <div className="font-medium">{dayjs(item.NGAYDI).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg> */}
                                            <TbPlaneArrival className='h-5 w-5 mr-3 text-orange-500' />
                                            <div>
                                                <div className="text-sm text-gray-500">Ngày về</div>
                                                <div className="font-medium">{dayjs(item.NGAYVE).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    <div className="p-4 rounded-lg mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v9a2 2 0 002 2h9a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 9H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-2" />
                                                </svg> */}
                                                <TbTrain className='h-5 w-5 mr-3 text-orange-500' />
                                                <div>
                                                    <div className="text-sm text-gray-500">Phương tiện</div>
                                                    <div className="font-medium">{item.PHUONGTIENDICHUYEN}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Giá từ</div>
                                                <div className="text-2xl font-bold text-orange-500">
                                                    {parseFloat(item.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToCheckout(item);
                                            }}
                                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Không tìm thấy kết quả.</p>
                )}

                <div className="flex justify-between mt-6">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                    >
                        Trang trước
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(filteredResults.length / toursPerPage)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;