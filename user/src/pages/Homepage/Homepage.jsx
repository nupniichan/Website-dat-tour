import AboutHome from "./AboutHome.jsx";
import Hero from "./Hero.jsx";
import "./Homepage.css";
import Newsletter from "./Newsletter.jsx";
import PopularDestinations from "./PopularDestinations.jsx";
import PopularTours from "./PopularTours.jsx";
import WhyUs from "./WhyUs.jsx";

const Homepage = () => {
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
