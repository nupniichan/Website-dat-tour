import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import AdminLogin from './AdminLogin.jsx';
import TourManagement from './TourManagement.jsx';
import ScheduleManagement from './ScheduleManagement.jsx';
import AddSchedule from './AddSchedule.jsx';
import ScheduleDetail from './ScheduleDetail.jsx';
import AddTour from './Addtour.jsx';
import EditSchedule from './EditSchedule.jsx';
import EditTour from './EditTour.jsx';
import BookingManagement from './BookingManagement.jsx';
import EditBookingManagement from './EditBookingManagement.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

function App() {
  // Kiểm tra trạng thái đăng nhập từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    // Cập nhật trạng thái đăng nhập vào localStorage khi trạng thái thay đổi
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Đặt trạng thái đăng nhập thành false
    localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập khỏi localStorage
  };

  return (
    <>
      {!isLoggedIn ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="d-flex flex-column vh-100">
          <div className='header'>
            <Header />
          </div>
          <div className="container-fluid flex-grow-1">
            <div className="row">
              <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                <Sidebar onLogout={handleLogout} /> {/* Truyền hàm logout */}
              </nav>
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="main-content">
                  <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Default route */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tour" element={<TourManagement />} />
                    <Route path="/schedule" element={<ScheduleManagement />} />
                    <Route path="/add-schedule" element={<AddSchedule />} />
                    <Route path="/edit-schedule/:id" element={<EditSchedule />} />
                    <Route path="/add-tour" element={<AddTour />} />
                    <Route path="/edit-tour/:id" element={<EditTour />} />
                    <Route path="/schedule/:id" element={<ScheduleDetail />} />
                    <Route path="/ticket" element={<BookingManagement />} />
                    <Route path="/edit-ticket/:id" element={<EditBookingManagement />} />
                    <Route path="/rate" element={<h1>Quản lý đánh giá</h1>} />
                    <Route path="/voucher" element={<h1>Quản lý mã giảm giá</h1>} />
                    <Route path="/user" element={<h1>Quản lý người dùng</h1>} />
                    <Route path="/income" element={<h1>Quản lý thu nhập</h1>} />
                    <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Catch-all route */}
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
