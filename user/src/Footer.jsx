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
            <li><a href="https://viettour.vn/gioi-thieu" target="_blank" rel="noopener noreferrer">Giới thiệu</a></li>
            <li><a href="https://viettour.vn/lien-he" target="_blank" rel="noopener noreferrer">Liên hệ</a></li>
            <li><a href="https://viettour.vn/thu-vien-api" target="_blank" rel="noopener noreferrer">Thư viện api</a></li>
          </ul>
        </div>
        <div className="section">
          <h3>Liên kết</h3>
          <ul>
            <li><a href="https://viettour.vn/facebook" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://viettour.vn/zalo" target="_blank" rel="noopener noreferrer">Zalo</a></li>
            <li><a href="https://viettour.vn/youtube" target="_blank" rel="noopener noreferrer">Youtube</a></li>
            <li><a href="https://viettour.vn/instagram" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
        <div className="section">
          <h3>Dịch vụ người dùng</h3>
          <ul>
            <li><a href="https://viettour.vn/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a></li>
            <li><a href="https:/viettour.vn/dieu-khoan" target="_blank" rel="noopener noreferrer">Điều khoản và điều kiện</a></li>
          </ul>
        </div>
      </div>
      <p className="copyright">@viettour.vn - Hệ thống cung cấp các tour du lịch tuyệt vời cho bạn.</p>
    </footer>
  );
};

export default Footer;
