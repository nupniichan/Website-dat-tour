// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // If not logged in or token is missing, reset username and exit
        if (!isLoggedIn || !token) {
          setUserName('');
          return;
        }

        const response = await fetch('http://localhost:3000/user-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUserName(data.FULLNAME);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserName(''); // Reset username on error
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

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
          <small>Xin chào</small>
          <span>{userName || 'Người dùng'}</span>
        </div>
      </div>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <>
            <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
            <button className="btn-register" onClick={() => window.location.href = '/register'}>Register</button>
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
