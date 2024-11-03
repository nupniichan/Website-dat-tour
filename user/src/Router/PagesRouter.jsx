import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Registration from "../pages/Register.jsx";
import About from "../pages/About.jsx";
import Checkout from "../pages/Checkout.jsx";
import Contact from "../pages/Contact.jsx";
import Homepage from "../pages/Homepage";
import PaymentFailed from "../pages/PaymentFailed.jsx";
import PaymentResult from "../pages/PaymentResult.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import Profile from "../pages/Profile.jsx";
import Schedule from "../pages/Schedule.jsx";
import SearchResults from "../pages/SearchResults.jsx";
import TourDetails from "../pages/TourDetails.jsx";
import TourHistory from "../pages/TourHistory.jsx";
import PagesNames from "./Router.js";

const PageRouter = ({ onLogin }) => {
    return (
        <Routes>
            <Route path={PagesNames.HOMEPAGE} element={<Homepage />} />
            <Route path={PagesNames.REGISTER} element={<Registration onLogin={onLogin} />} />
            <Route path={PagesNames.ABOUT} element={<About />} />
            <Route path={PagesNames.CHECKOUT} element={<Checkout />} />
            <Route path={PagesNames.SEARCH_RESULTS} element={<SearchResults />} />
            <Route path={PagesNames.TOUR_DETAILS} element={<TourDetails />} /> {/* Route cho trang tour details */}
            <Route path={PagesNames.TOUR_HISTORY} element={<TourHistory />} />
            <Route path={PagesNames.SCHEDULE} element={<Schedule />} />
            <Route path={PagesNames.CONTACT} element={<Contact />} />
            <Route path={PagesNames.LOGIN} element={<Login onLogin={onLogin} />} />
            <Route path={PagesNames.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
            <Route path={PagesNames.PAYMENT_FAILED} element={<PaymentFailed />} />
            <Route path={PagesNames.PAYMENT_RESULT} element={<PaymentResult />} />
            <Route path={PagesNames.PROFILE} element={<Profile />} />
        </Routes>
    );
};

export default PageRouter;
