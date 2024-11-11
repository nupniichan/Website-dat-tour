import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng nhập thành công!');
        onLoginSuccess();
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError('Lỗi server');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Trang đăng nhập admin</h2>

        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-login">SIGN IN</button>
        {loginError && <p className="error-message">{loginError}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
