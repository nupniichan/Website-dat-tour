import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import AdminLogin from './AdminLogin.jsx';
import TourManagement from './TourManagement.jsx';
import ScheduleManagement from './ScheduleManagement.jsx';
import AddSchedule from './AddSchedule.jsx'; // Import component thêm lịch trình
import ScheduleDetail from './ScheduleDetail.jsx'; // Import component chi tiết lịch trình
import AddTour from './Addtour.jsx';
import EditSchedule from './EditSchedule.jsx';
import EditTour from './EditTour.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
                <Sidebar />
              </nav>
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tour" element={<TourManagement />} />
                    <Route path="/schedule" element={<ScheduleManagement />} />
                    <Route path="/add-schedule" element={<AddSchedule />} />
                    <Route path="/edit-schedule/:id" element={<EditSchedule />} />
                    <Route path="/add-tour" element={<AddTour />} />
                    <Route path="/edit-tour/:id" element={<EditTour />} />
                    <Route path="/schedule/:id" element={<ScheduleDetail />} /> 
                    <Route path="/ticket" element={<h1>Quản lý danh sách đặt</h1>} />
                    <Route path="/rate" element={<h1>Quản lý đánh giá</h1>} />
                    <Route path="/voucher" element={<h1>Quản lý mã giảm giá</h1>} />
                    <Route path="/user" element={<h1>Quản lý người dùng</h1>} />
                    <Route path="/income" element={<h1>Quản lý thu nhập</h1>} />
                    {/* Thêm các route khác nếu cần */}
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
