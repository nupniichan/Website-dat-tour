import React from 'react';
import './Header.css'; // File CSS để định dạng

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span>VIETTOUR.VN</span>
      </div>
      <div className="search">
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
     
        <div className="user-profile">
          <img src="/src/img/avatar.png" alt="Ảnh đại diện" />
          <div className="user-info">
            <small>Xin chào</small> {/* Chữ nhỏ ở phía trên */}
            <span>Lâm Tuấn Thành</span>
          </div>
        </div>
      
    </header>
  );
};

export default Header;
