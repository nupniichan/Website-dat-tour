import { Route, Routes } from "react-router-dom";
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
import PagesNames from "./PagesNames.js";

const PageRouter = () => {
    return (
        <Routes>
            <Route path={PagesNames.HOMEPAGE} element={<Homepage />} />
            <Route path={PagesNames.ABOUT} element={<About />} />
            <Route path={PagesNames.SEARCH_RESULTS} element={<SearchResults />} />
            <Route path={`${PagesNames.TOUR_DETAILS}/:id`} element={<TourDetails />} />
            <Route path={`${PagesNames.CHECKOUT}/:id`} element={<Checkout />} />
            <Route path={PagesNames.TOUR_HISTORY} element={<TourHistory />} />
            <Route path={PagesNames.SCHEDULE} element={<Schedule />} />
            <Route path={PagesNames.CONTACT} element={<Contact />} />
            <Route path={PagesNames.PROFILE} element={<Profile />} />
            <Route path={PagesNames.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
            <Route path={PagesNames.PAYMENT_FAILED} element={<PaymentFailed />} />
            <Route path={PagesNames.PAYMENT_RESULT} element={<PaymentResult />} />
        </Routes>
    );
};

export default PageRouter;
