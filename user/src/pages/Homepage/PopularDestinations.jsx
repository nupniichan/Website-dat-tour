import { useNavigate } from "react-router-dom";
import cities from "../../json/cities.json";
import dayjs from "dayjs";

dayjs.locale('vi');

const PopularDestinations = () => {
    const navigate = useNavigate();

    const handleDestinationClick = async (cityName) => {
        const departureDate = dayjs().add(2, 'day').format('YYYY-MM-DD');

        try {
            const apiUrl = `http://localhost:5000/search/tour-with-date?q=${cityName}&date=${departureDate}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Lỗi mạng.');
            }

            const data = await response.json();

            navigate(`/search/${cityName}/${departureDate}`, {
                state: { results: data }
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 top-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Điểm Đến Phổ Biến
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cities.slice(0, 6).map((city, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2 cursor-pointer"
                            onClick={() => handleDestinationClick(city.city)}
                        >
                            <img
                                src={
                                    city.image ||
                                    `/src/assets/cities/${city.city}.jpg`
                                }
                                alt={city.city}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {city.city}
                                </h3>
                                <p className="text-gray-600">
                                    {city.description ||
                                        "Khám phá vẻ đẹp và văn hóa độc đáo"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;
