// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Footer.css'; // Regular CSS import

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="section">
          <h3>viettour.vn</h3>
          <p>Email:  
            <a href="mailto:contact@viettour.vn"> contact@viettour.vn</a>
          </p>
          <p>Page: 
            <a href="https://viettour.vn" target="_blank" rel="noopener noreferrer"> VIETTOUR.VN</a>
          </p>
        </div>
        <div className="section">
          <h3>Trang</h3>
          <ul>
            <li><a href="https://example.com/gioi-thieu" target="_blank" rel="noopener noreferrer">Giới thiệu</a></li>
            <li><a href="https://example.com/lien-he" target="_blank" rel="noopener noreferrer">Liên hệ</a></li>
            <li><a href="https://example.com/chung-chi" target="_blank" rel="noopener noreferrer">Chứng chỉ</a></li>
            <li><a href="https://example.com/thu-vien-tai-lieu" target="_blank" rel="noopener noreferrer">Thư viện tài liệu</a></li>
          </ul>
        </div>
        <div className="section">
          <h3>Liên kết</h3>
          <ul>
            <li><a href="https://example.com/tai-lieu" target="_blank" rel="noopener noreferrer">Tài liệu</a></li>
            <li><a href="https://example.com/lab-blog" target="_blank" rel="noopener noreferrer">Lab blog</a></li>
            <li><a href="https://dockerhub.com" target="_blank" rel="noopener noreferrer">Dockerhub</a></li>
            <li><a href="https://example.com/tour-vietnam" target="_blank" rel="noopener noreferrer">Tour VietNam</a></li>
          </ul>
        </div>
        <div className="section">
          <h3>Dịch vụ người dùng</h3>
          <ul>
            <li><a href="https://example.com/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a></li>
            <li><a href="https://example.com/dieu-khoan" target="_blank" rel="noopener noreferrer">Điều khoản và điều kiện</a></li>
          </ul>
        </div>
      </div>
      <p className="copyright">@viettour.vn - Hệ thống cung cấp các tour du lịch tuyệt vời cho bạn.</p>
    </footer>
  );
};

export default Footer;
