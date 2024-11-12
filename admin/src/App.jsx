import { message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AddReview from "./AddReview.jsx";
import AddSchedule from "./AddSchedule.jsx";
import AddTour from "./AddTour.jsx";
import AddUser from "./AddUser.jsx";
import AdminLogin from "./AdminLogin.jsx";
import "./App.css";
import BookingManagement from "./BookingManagement.jsx";
import Dashboard from "./Dashboard.jsx";
import DiscountManagement from "./DiscountManagement.jsx";
import EditBookingManagement from "./EditBookingManagement.jsx";
import EditDiscount from "./EditDiscount.jsx";
import EditReview from "./EditReview.jsx";
import EditSchedule from "./EditSchedule.jsx";
import EditTour from "./EditTour.jsx";
import EditUser from "./EditUser.jsx";
import Header from "./Header.jsx";
import IncomeManagement from "./IncomeManagement.jsx";
import "./index.css";
import ReviewManagement from "./ReviewManagement.jsx";
import ScheduleDetail from "./ScheduleDetail.jsx";
import ScheduleManagement from "./ScheduleManagement.jsx";
import Sidebar from "./Sidebar.jsx";
import TourManagement from "./TourManagement.jsx";
import UserManagement from "./UserManagement.jsx";
function App() {
    // Kiểm tra trạng thái đăng nhập từ sessionStorage
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem("isLoggedIn") === "true"
    );

    useEffect(() => {
        // Cập nhật trạng thái đăng nhập vào sessionStorage khi trạng thái thay đổi
        sessionStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn]);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false); // Đặt trạng thái đăng nhập thành false
        sessionStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập khỏi sessionStorage
        message.success({content: "Đăng xuất thành công"});
    };

    return (
        <>
            {!isLoggedIn ? (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
                <div className="d-flex flex-column vh-100">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="container-fluid flex-grow-1">
                        <div className="row">
                            <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                                <Sidebar onLogout={handleLogout} />{" "}
                                {/* Truyền hàm logout */}
                            </nav>
                            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                                <div className="main-content">
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={
                                                <Navigate to="/dashboard" />
                                            }
                                        />{" "}
                                        {/* Default route */}
                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/tour"
                                            element={<TourManagement />}
                                        />
                                        <Route
                                            path="/schedule"
                                            element={<ScheduleManagement />}
                                        />
                                        <Route
                                            path="/add-schedule"
                                            element={<AddSchedule />}
                                        />
                                        <Route
                                            path="/edit-schedule/:id"
                                            element={<EditSchedule />}
                                        />
                                        <Route
                                            path="/add-tour"
                                            element={<AddTour />}
                                        />
                                        <Route
                                            path="/add-review"
                                            element={<AddReview />}
                                        />
                                        <Route
                                            path="/edit-tour/:id"
                                            element={<EditTour />}
                                        />
                                        <Route
                                            path="/edit-review/:id"
                                            element={<EditReview />}
                                        />
                                        <Route
                                            path="/schedule/:id"
                                            element={<ScheduleDetail />}
                                        />
                                        <Route
                                            path="/ticket"
                                            element={<BookingManagement />}
                                        />
                                        <Route
                                            path="/edit-ticket/:id"
                                            element={<EditBookingManagement />}
                                        />
                                        <Route
                                            path="/voucher"
                                            element={<DiscountManagement />}
                                        />
                                        <Route
                                            path="/edit-voucher/:id"
                                            element={<EditDiscount />}
                                        />
                                        <Route
                                            path="/review"
                                            element={<ReviewManagement />}
                                        />
                                        <Route
                                            path="/user"
                                            element={<UserManagement />}
                                        />
                                        <Route
                                            path="/add-user"
                                            element={<AddUser />}
                                        />
                                        <Route
                                            path="/edit-user/:id"
                                            element={<EditUser />}
                                        />
                                        <Route
                                            path="/income"
                                            element={<IncomeManagement />}
                                        />
                                    </Routes>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
