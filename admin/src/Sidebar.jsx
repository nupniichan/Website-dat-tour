import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ selectedContent, onLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout(); // Gọi hàm logout
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="sidebar">
      <input type="text" placeholder="Nhập chức năng cần tìm..." className="search-bar" />
      <ul className="sidebar-menu">
        <li className={`menu-item ${selectedContent === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('/')}>
          <img className="menu-icon" src="src/img/icon/dashboard.png" alt="Dashboard" />
          <span>Dashboard</span>
        </li>
        <li className={`menu-item ${selectedContent === 'tour' ? 'active' : ''}`} onClick={() => handleNavigation('/tour')}>
          <img className="menu-icon" src="src/img/icon/destination.png" alt="Quản lý tour" />
          <span>Quản lý tour</span>
        </li>
        <li className={`menu-item ${selectedContent === 'schedule' ? 'active' : ''}`} onClick={() => handleNavigation('/schedule')}>
          <img className="menu-icon" src="src/img/icon/schedule.png" alt="Quản lý lịch trình" />
          <span>Quản lý lịch trình</span>
        </li>
        <li className={`menu-item ${selectedContent === 'ticket' ? 'active' : ''}`} onClick={() => handleNavigation('/ticket')}>
          <img className="menu-icon" src="src/img/icon/ticket.png" alt="Quản lý danh sách đặt" />
          <span>Quản lý danh sách đặt</span>
        </li>
        <li className={`menu-item ${selectedContent === 'review' ? 'active' : ''}`} onClick={() => handleNavigation('/review')}>
          <img className="menu-icon" src="src/img/icon/star.png" alt="Quản lý đánh giá" />
          <span>Quản lý đánh giá</span>
        </li>
        <li className={`menu-item ${selectedContent === 'voucher' ? 'active' : ''}`} onClick={() => handleNavigation('/voucher')}>
          <img className="menu-icon" src="src/img/icon/voucher.png" alt="Quản lý mã giảm giá" />
          <span>Quản lý mã giảm giá</span>
        </li>
        <li className={`menu-item ${selectedContent === 'user' ? 'active' : ''}`} onClick={() => handleNavigation('/user')}>
          <img className="menu-icon" src="src/img/icon/user.png" alt="Quản lý người dùng" />
          <span>Quản lý người dùng</span>
        </li>
        <li className={`menu-item ${selectedContent === 'income' ? 'active' : ''}`} onClick={() => handleNavigation('/income')}>
          <img className="menu-icon" src="src/img/icon/money.png" alt="Quản lý tổng thu nhập" />
          <span>Quản lý thu nhập</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <ul className="sidebar-footer-menu">
          <li className="menu-item">
            <img className="menu-icon" src="src/img/icon/settings.png" alt="Settings" />
            <span>Settings</span>
          </li>
          <li className="menu-item" onClick={handleLogout}>
            <img className="menu-icon" src="src/img/icon/logout.png" alt="Logout" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
