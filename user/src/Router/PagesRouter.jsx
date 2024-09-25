import { Routes, Route } from "react-router";
import PagesNames from "./PagesNames.js";
import Homepage from "../pages/Homepage";
import About from "../pages/About.jsx";
import Checkout from "../pages/Checkout.jsx";
import SearchResults from "../pages/SearchResults.jsx";
import TourDetails from "../pages/TourDetails.jsx";
import Schedule from "../pages/Schedule.jsx";
import Registration from "../pages/Registration.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Registration.jsx"; // Make sure to import Login if it's used

const PageRouter = ({ onLogin }) => {
    return (
        <Routes>
            <Route path={PagesNames.HOMEPAGE} element={<Homepage />} />
            <Route path={PagesNames.REGISTRATION} element={<Registration onLogin={onLogin} />} />
            <Route path={PagesNames.ABOUT} element={<About />} />
            <Route path={PagesNames.CHECKOUT} element={<Checkout />} />
            <Route path={PagesNames.SEARCH_RESULTS} element={<SearchResults />} />
            <Route path={PagesNames.TOUR_DETAILS} element={<TourDetails />} />
            <Route path={PagesNames.SCHEDULE} element={<Schedule />} />
            <Route path={PagesNames.CONTACT} element={<Contact />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} /> {/* Ensure you have a Login component if used */}
        </Routes>
    )
}

export default PageRouter;
