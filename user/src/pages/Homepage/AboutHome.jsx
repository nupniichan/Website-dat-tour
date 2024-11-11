import { Image } from "antd";
import checkbox from "../../assets/stock/checkbox.svg";
import about1 from "../../assets/stock/about1.jpg";
import about2 from "../../assets/stock/about2.jpg";
import about3 from "../../assets/stock/about3.jpg";
import about4 from "../../assets/stock/about4.jpg";

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
            <div className="flex flex-col gap-8 lg:flex-row items-center justify-center pb-24">
                {/* LEFT section */}
                <div className="flex flex-1 flex-col items-start justify-center">
                    <h1 className="text-[48px] font-bold pb-4 capitalize">
                        join us in exploring the world.
                    </h1>
                    <p className="text-gray-600">
                        Aliquip non enim commodo excepteur fugiat. Exercitation
                        cillum nostrud laborum quis. Laborum in dolore
                        exercitation laboris ex deserunt dolor nostrud magna
                        aliquip. Ex eiusmod ut et tempor consequat.
                    </p>
                    <br />
                    <p className="text-gray-600">
                        Tempor minim commodo eiusmod labore officia qui
                        incididunt quis nulla. Laboris dolore ullamco pariatur
                        pariatur consectetur sunt velit eiusmod pariatur veniam
                        ut non. Velit adipisicing eiusmod tempor consectetur
                        pariatur.
                    </p>

                    <div className="flex flex-wrap mt-8">
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
                <div className="flex flex- gap-4 lg:gap-8">
                    <Image
                        src={about1}
                        alt="about"
                        height={444}
                        width={333}
                        className="w-auto rounded-lg border border-gray-200 mb-12"
                    />
                </div>
                <div className="flex flex- gap-4 lg:gap-8">
                    <Image
                        src={about2}
                        alt="about"
                        height={444}
                        width={333}
                        placeholder="true"
                        className="w-auto rounded-lg border border-gray-200 mt-12"
                    />
                </div>
            </div>

            {/* 2nd Container */}
            <div className="flex flex-col gap-8 lg:flex-row items-center justify-center pb-24 mt-14">
                {/* LEFT section */}
                <div className="flex flex- gap-4 lg:gap-8">
                    <Image
                        src={about3}
                        alt="about"
                        height={444}
                        width={333}
                        className="w-auto rounded-lg border border-gray-200 mb-12"
                    />
                </div>
                <div className="flex flex- gap-4 lg:gap-8">
                    <Image
                        src={about4}
                        alt="about"
                        height={444}
                        width={333}
                        placeholder="true"
                        className="w-auto rounded-lg border border-gray-200 mt-12"
                    />
                </div>

                {/* RIGHT section */}
                <div className="flex flex-1 flex-col items-start justify-center">
                    <h1 className="text-[48px] font-bold pb-4 capitalize">
                        Creating unforgettable travel experiences.
                    </h1>
                    <p className="text-gray-600">
                        Aliquip non enim commodo excepteur fugiat. Exercitation
                        cillum nostrud laborum quis. Laborum in dolore
                        exercitation laboris ex deserunt dolor nostrud magna
                        aliquip. Ex eiusmod ut et tempor consequat.
                    </p>
                    <br />
                    <p className="text-gray-600">
                        Tempor minim commodo eiusmod labore officia qui
                        incididunt quis nulla. Laboris dolore ullamco pariatur
                        pariatur consectetur sunt velit eiusmod pariatur veniam
                        ut non. Velit adipisicing eiusmod tempor consectetur
                        pariatur.
                    </p>

                    <div className="flex flex-wrap mt-8">
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
