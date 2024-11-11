import AboutHome from "./AboutHome.jsx";
import Hero from "./Hero.jsx";
import "./Homepage.css";

const Homepage = () => {

    return (
        <>
            <Hero />

            <AboutHome />

            <main className="main mb-80">
                <div className="middle"></div>
            </main>
        </>
    );
};

export default Homepage;
