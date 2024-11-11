import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState(''); // Biến lưu lỗi chung từ server

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/check-email?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setGeneralError(''); // Reset lại thông báo lỗi trước đó

    try {
      // Kiểm tra email trùng lặp trước khi gửi form
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setEmailError('Email đã được sử dụng. Vui lòng chọn email khác.');
        return;
      }

      // Gửi dữ liệu đăng ký lên server
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

      if (!response.ok) {
        const errorData = await response.json();
        // Xử lý lỗi từ server trả về
        if (errorData.message === 'Email already exists!') {
          setEmailError('Email đã được sử dụng. Vui lòng chọn email khác.');
        } else {
          setGeneralError(errorData.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        }
        return;
      }

      // Đăng ký thành công
      const data = await response.json();
      alert(data.message); // Thông báo thành công
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      console.error('Error during registration:', error);
      setGeneralError('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(''); // Xóa thông báo lỗi khi người dùng thay đổi email
    setGeneralError(''); // Xóa thông báo lỗi chung khi thay đổi thông tin
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="fullname">Họ tên:</label>
        <input
          type="text"
          id="fullname"
          placeholder="Họ tên"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Số điện thoại:</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="Số điện thoại"
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
          onChange={handleEmailChange}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>} {/* Hiển thị lỗi email */}

        <label htmlFor="address">Địa chỉ:</label>
        <input
          type="text"
          id="address"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label htmlFor="dayOfBirth">Ngày sinh:</label>
        <input
          type="date"
          id="dayOfBirth"
          value={dayOfBirth}
          onChange={(e) => setDayOfBirth(e.target.value)}
          required
        />

        <label htmlFor="accountName">Tên tài khoản:</label>
        <input
          type="text"
          id="accountName"
          placeholder="Tên tài khoản"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />

        <label htmlFor="password">Mật khẩu:</label>
        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {generalError && <p className="error-message">{generalError}</p>} {/* Hiển thị lỗi chung */}
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
