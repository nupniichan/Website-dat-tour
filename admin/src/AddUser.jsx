import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [user, setUser] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    dayOfBirth: '',
    accountName: '',
  });
  const [userPassword, setUserPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false); // New state for phone existence
  const [accountNameExists, setAccountNameExists] = useState(false); // New state for account name existence
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userPassword') setUserPassword(value);
    if (name === 'rePassword') setRePassword(value);
  };

  const validateEmail = async (email) => {
    const response = await fetch('http://localhost:5000/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setEmailExists(data.exists);
  };

  const validatePhone = async (phone) => {
    const response = await fetch('http://localhost:5000/check-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    setPhoneExists(data.exists);
  };

  const validateAccountName = async (accountName) => {
    const response = await fetch('http://localhost:5000/check-accountname', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountName }),
    });
    const data = await response.json();
    setAccountNameExists(data.exists);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.fullName) {
      newErrors.fullName = 'Tên đầy đủ không được để trống';
    } else if (!/\s/.test(user.fullName)) { // Kiểm tra xem có ít nhất một khoảng trắng không
      newErrors.fullName = 'Tên đầy đủ phải có ít nhất một khoảng trắng';
    }
    if (!user.phone) newErrors.phone = 'Số điện thoại không được để trống';
    else if (phoneExists) newErrors.phone = 'Số điện thoại đã tồn tại'; // Kiểm tra số điện thoại tồn tại
    if (!user.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'Email không hợp lệ';
    else if (emailExists) newErrors.email = 'Email đã tồn tại'; // Kiểm tra email tồn tại
    if (!userPassword) newErrors.userPassword = 'Mật khẩu không được để trống';
    else if (userPassword.length < 6) newErrors.userPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!rePassword) newErrors.rePassword = 'Xác nhận mật khẩu không được để trống';
    else if (userPassword !== rePassword) newErrors.rePassword = 'Mật khẩu xác nhận không khớp';
    if (!user.dayOfBirth) newErrors.dayOfBirth = 'Ngày sinh không được để trống';
    if (!user.accountName) newErrors.accountName = 'Tên tài khoản không được để trống';
    else if (accountNameExists) newErrors.accountName = 'Tên tài khoản đã tồn tại'; // Kiểm tra tên tài khoản tồn tại
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };
  

  const handleEmailChange = async (e) => {
    const { value } = e.target;
    setUser((prev) => ({ ...prev, email: value }));
    if (value) {
      await validateEmail(value); // Check email existence on change
    } else {
      setEmailExists(false); // Reset if email field is empty
    }
  };

  const handlePhoneChange = async (e) => {
    const { value } = e.target;
    setUser((prev) => ({ ...prev, phone: value }));
    if (value) {
      await validatePhone(value); // Check phone existence on change
    } else {
      setPhoneExists(false); // Reset if phone field is empty
    }
  };

  const handleAccountNameChange = async (e) => {
    const { value } = e.target;
    setUser((prev) => ({ ...prev, accountName: value }));
    if (value) {
      await validateAccountName(value); // Check account name existence on change
    } else {
      setAccountNameExists(false); // Reset if account name field is empty
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    const data = {
      fullname: user.fullName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      dayofbirth: user.dayOfBirth,
      accountname: user.accountName,
      password: userPassword, // Only send userPassword
    };

    try {
      const response = await fetch('http://localhost:5000/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Thêm người dùng thành công!');
        navigate('/user');
      } else {
        alert('Lỗi khi thêm người dùng: ' + result.message);
      }
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <Box padding={3}>
      <h3>Thêm người dùng mới</h3>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên đầy đủ"
          fullWidth
          name="fullName"
          value={user.fullName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.fullName}
          helperText={errors.fullName}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Số điện thoại"
          type="tel"
          fullWidth
          name="phone"
          value={user.phone}
          onChange={handlePhoneChange} // Changed to handlePhoneChange
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          name="email"
          value={user.email}
          onChange={handleEmailChange}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Địa chỉ"
          fullWidth
          name="address"
          value={user.address}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ 
            shrink: true
          }}
          
        />
        <TextField
          label="Ngày sinh"
          type="date"
          fullWidth
          name="dayOfBirth"
          value={user.dayOfBirth}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Tên tài khoản"
          fullWidth
          name="accountName"
          value={user.accountName}
          onChange={handleAccountNameChange} // Changed to handleAccountNameChange
          margin="normal"
          error={!!errors.accountName}
          helperText={errors.accountName}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          name="userPassword"
          value={userPassword}
          onChange={handleDetailChange}
          margin="normal"
          error={!!errors.userPassword}
          helperText={errors.userPassword}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />
        <TextField
          label="Xác nhận mật khẩu"
          type="password"
          fullWidth
          name="rePassword"
          value={rePassword}
          onChange={handleDetailChange}
          margin="normal"
          error={!!errors.rePassword}
          helperText={errors.rePassword}
          InputLabelProps={{ 
            shrink: true,
            style: { color: 'red' } // Đặt màu chữ thành đỏ
          }}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
        >
          Lưu
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/user')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default AddUser;
