import { Image } from "antd";
import about1 from "../../assets/stock/about1.jpg";
import about2 from "../../assets/stock/about2.jpg";
import about3 from "../../assets/stock/about3.jpg";
import about4 from "../../assets/stock/about4.jpg";
import checkbox from "../../assets/stock/checkbox.svg";

const AboutItem = ({ title, icon }) => {
    return (
        <div className="w-1/2 flex gap-2 mb-4">
            <img src={icon} alt="icon" height={20} width={20} />
            <div className="text-[16px] font-normal">{title}</div>
        </div>
    );
};

const aboutItems = [
    { title: "Comfortable Journey", icon: checkbox },
    { title: "Luxurious Hotels", icon: checkbox },
    { title: "Travel Guide", icon: checkbox },
    { title: "Great Destination", icon: checkbox },
];

const aboutItems2 = [
    { title: "Personalized Itineraries", icon: checkbox },
    { title: "Exclusive Experiences", icon: checkbox },
    { title: "Seamless Planning", icon: checkbox },
    { title: "Cultural Immersion", icon: checkbox },
];

const AboutHome = () => {
    return (
        <section className="mx-auto max-w-screen-2xl px-6 lg:px-20 2xl:px-0 py-24">
            {/* 1nd Container */}
            <div className="flex flex-col gap-8 xl:flex-row items-center justify-center pb-24 2xl:mx-0 xl:mx-5 lg:mx-1 md:mx-10 mx-5">
                {/* LEFT section */}
                <div className="flex flex-1 flex-col items-start justify-center">
                    <h1
                        className="text-[48px] font-bold pb-4 capitalize xl:mr-14"
                        data-aos="fade-right"
                        data-aos-duration="500"
                        data-aos-delay="0"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Đi cùng chúng tôi khám phá thế giới.
                    </h1>
                    <p
                        className="text-gray-600 "
                        data-aos="fade-right"
                        data-aos-duration="500"
                        data-aos-delay="300"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Aliquip non enim commodo excepteur fugiat. Exercitation
                        cillum nostrud laborum quis. Laborum in dolore
                        exercitation laboris ex deserunt dolor nostrud magna
                        aliquip. Ex eiusmod ut et tempor consequat.
                    </p>
                    <br />
                    <p
                        className="text-gray-600 "
                        data-aos="fade-right"
                        data-aos-duration="500"
                        data-aos-delay="600"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Tempor minim commodo eiusmod labore officia qui
                        incididunt quis nulla. Laboris dolore ullamco pariatur
                        pariatur consectetur sunt velit eiusmod pariatur veniam
                        ut non. Velit adipisicing eiusmod tempor consectetur
                        pariatur.
                    </p>

                    <div
                        className="flex flex-wrap mt-8"
                        data-aos="fade-up"
                        data-aos-duration="500"
                        data-aos-delay="600"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        {aboutItems.map((about) => (
                            <AboutItem
                                key={about.title}
                                title={about.title}
                                icon={about.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT section */}
                <div className="flex flex-row gap-8 xl:scale-100 md:scale-90 scale-75 xl:mt-0 md:mt-7 -mt-4">
                    <div className="flex gap-4 lg:gap-8">
                        <Image
                            src={about1}
                            alt="about"
                            height={444}
                            width={333}
                            className="w-auto rounded-lg border border-gray-200 mb-12"
                            preview={false}
                            placeholder="true"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                        />
                    </div>
                    <div className="flex gap-4 lg:gap-8">
                        <Image
                            src={about2}
                            alt="about"
                            height={444}
                            width={333}
                            preview={false}
                            placeholder="true"
                            className="w-auto rounded-lg border border-gray-200 mt-12"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                        />
                    </div>
                </div>
            </div>

            {/* 2nd Container */}
            <div className="flex flex-col gap-8 xl:flex-row items-center justify-center xl:mt-16 -mt-32 pb-24 2xl:mx-0 xl:mx-5 lg:mx-1 md:mx-10 mx-5">
                {/* LEFT section */}
                <div className="flex flex-row gap-8 xl:scale-100 md:scale-90 scale-75 xl:mt-0 md:mt-7 -mt-4">
                    <div className="flex gap-4 lg:gap-8">
                        <Image
                            src={about3}
                            alt="about"
                            height={444}
                            width={333}
                            className="w-auto rounded-lg border border-gray-200 mb-12"
                            preview={false}
                            placeholder="true"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                        />
                    </div>
                    <div className="flex gap-4 lg:gap-8">
                        <Image
                            src={about4}
                            alt="about"
                            height={444}
                            width={333}
                            className="w-auto rounded-lg border border-gray-200 mt-12"
                            preview={false}
                            placeholder="true"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay='500'
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                        />
                    </div>
                </div>

                {/* RIGHT section */}
                <div className="flex flex-1 flex-col items-start justify-center xl:mt-0 mt-12">
                    <h1
                        className="text-[48px] font-bold pb-4 capitalize"
                        data-aos="fade-left"
                        data-aos-duration="500"
                        data-aos-delay="0"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Tạo ra những kỉ niệm khó quên.
                    </h1>
                    <p
                        className="text-gray-600"
                        data-aos="fade-left"
                        data-aos-duration="500"
                        data-aos-delay="300"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Aliquip non enim commodo excepteur fugiat. Exercitation
                        cillum nostrud laborum quis. Laborum in dolore
                        exercitation laboris ex deserunt dolor nostrud magna
                        aliquip. Ex eiusmod ut et tempor consequat.
                    </p>
                    <br />
                    <p
                        className="text-gray-600"
                        data-aos="fade-left"
                        data-aos-duration="500"
                        data-aos-delay="600"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        Tempor minim commodo eiusmod labore officia qui
                        incididunt quis nulla. Laboris dolore ullamco pariatur
                        pariatur consectetur sunt velit eiusmod pariatur veniam
                        ut non. Velit adipisicing eiusmod tempor consectetur
                        pariatur.
                    </p>

                    <div
                        className="flex flex-wrap mt-8"
                        data-aos="fade-up"
                        data-aos-duration="500"
                        data-aos-delay="600"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        {aboutItems2.map((about) => (
                            <AboutItem
                                key={about.title}
                                title={about.title}
                                icon={about.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHome;
