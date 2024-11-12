const WhyUs = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2
                    className="text-3xl font-bold text-center mb-16"
                    data-aos="zoom-out-up"
                    data-aos-duration="500"
                    data-aos-once={false}
                    data-aos-anchor-placement="center-bottom"
                >
                    Tại Sao Chọn Chúng Tôi?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration={800}
                        data-aos-delay={400}
                        data-aos-once={false}
                    >
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Giá Cả Hợp Lý
                        </h3>
                        <p className="text-gray-600">
                            Cam kết mang đến những tour du lịch chất lượng với
                            giá tốt nhất
                        </p>
                    </div>

                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration={800}
                        data-aos-delay={600}
                        data-aos-once={false}
                    >
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            An Toàn & Tin Cậy
                        </h3>
                        <p className="text-gray-600">
                            Đảm bảo an toàn và chất lượng dịch vụ cho mọi chuyến
                            đi
                        </p>
                    </div>

                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration={800}
                        data-aos-delay={800}
                        data-aos-once={false}
                    >
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Tiết Kiệm Thời Gian
                        </h3>
                        <p className="text-gray-600">
                            Quy trình đặt tour nhanh chóng và thuận tiện
                        </p>
                    </div>

                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration={800}
                        data-aos-delay={1000}
                        data-aos-once={false}
                    >
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Hỗ Trợ 24/7
                        </h3>
                        <p className="text-gray-600">
                            Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng phục vụ
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
