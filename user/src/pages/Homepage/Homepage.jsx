import AOS from "aos";
import "aos/dist/aos.css";
import AboutHome from "./AboutHome.jsx";
import Hero from "./Hero.jsx";
import "./Homepage.css";
import Newsletter from "./Newsletter.jsx";
import PopularDestinations from "./PopularDestinations.jsx";
import PopularTours from "./PopularTours.jsx";
import WhyUs from "./WhyUs.jsx";
import { useEffect } from "react";

const Homepage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <>
            <Hero />

            <AboutHome />

            <PopularDestinations />

            <WhyUs />

            <PopularTours />

            <Newsletter />
        </>
    );
};

export default Homepage;
