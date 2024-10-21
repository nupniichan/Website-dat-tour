import { Routes, Route } from "react-router-dom";
import PagesNames from "./PagesNames.js";
import Homepage from "../pages/Homepage";
import About from "../pages/About.jsx";
import Checkout from "../pages/Checkout.jsx";
import SearchResults from "../pages/SearchResults.jsx";
import TourDetails from "../pages/TourDetails.jsx";
import Schedule from "../pages/Schedule.jsx";
import Registration from "../pages/Register.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Login.jsx";
import PaymentResult from "../pages/PaymentResult.jsx";
import PaymentFailed from "../pages/PaymentFailed.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import Profile from "../pages/Profile.jsx";
import TourHistory from "../pages/TourHistory.jsx";

const PageRouter = ({ onLogin }) => {
    return (
        <Routes>
            <Route path={PagesNames.HOMEPAGE} element={<Homepage />} />
            <Route path={PagesNames.REGISTRATION} element={<Registration onLogin={onLogin} />} />
            <Route path={PagesNames.ABOUT} element={<About />} />
            <Route path={PagesNames.CHECKOUT} element={<Checkout />} /> {/* Không cần thêm `/:tourId` vì đã có trong PagesNames */}
            <Route path={PagesNames.SEARCH_RESULTS} element={<SearchResults />} />
            <Route path={PagesNames.TOUR_DETAILS} element={<TourDetails />} /> {/* Route cho trang tour details */}
            <Route path={PagesNames.TOUR_HISTORY} element={<TourHistory />} />
            <Route path={PagesNames.SCHEDULE} element={<Schedule />} />
            <Route path={PagesNames.CONTACT} element={<Contact />} />
            <Route path={PagesNames.LOGIN} element={<Login onLogin={onLogin} />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/user-profile/" element={<Profile />} />
        </Routes>
    );
};

export default PageRouter;
