import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css';

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        phoneNumber,
        email,
        address,
        dayOfBirth,
        accountName,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      navigate('/login'); // Redirect to login on successful registration
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullname">Họ tên:</label>
        <input
          type="text"
          id="fullname"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Số điện thoại:</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="address">Địa chỉ:</label>
        <input
          type="text"
          id="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label htmlFor="dayOfBirth">Ngày sinh:</label>
        <input
          type="date"
          id="dayOfBirth"
          placeholder="Date of Birth"
          value={dayOfBirth}
          onChange={(e) => setDayOfBirth(e.target.value)}
          required
        />

        <label htmlFor="accountName">Tên tài khoản:</label>
        <input
          type="text"
          id="accountName"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />

        <label htmlFor="password">Mật khẩu:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;

