import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Card, CardContent,
  Grid, Paper, IconButton, InputAdornment, Alert,
  Tooltip, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
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

  const isValidVietnamesePhone = (phone) => {
    const vietnamesePhoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
    return vietnamesePhoneRegex.test(phone);
  };

  const isValidBirthDate = (birthDate) => {
    const today = new Date();
    const selectedDate = new Date(birthDate);
    
    if (selectedDate > today) {
      return { isValid: false, message: 'Ngày sinh không thể là ngày trong tương lai' };
    }
    
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return { isValid: false, message: 'Người dùng phải đủ 18 tuổi' };
    }
    
    return { isValid: true, message: '' };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.fullName) {
      newErrors.fullName = 'Tên đầy đủ không được để trống';
    } else if (!/\s/.test(user.fullName)) {
      newErrors.fullName = 'Tên đầy đủ phải có ít nhất một khoảng trắng';
    }

    if (!user.phone) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!isValidVietnamesePhone(user.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)';
    } else if (phoneExists) {
      newErrors.phone = 'Số điện thoại đã tồn tại';
    }

    if (!user.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else if (emailExists) {
      newErrors.email = 'Email đã tồn tại';
    }

    if (!user.dayOfBirth) {
      newErrors.dayOfBirth = 'Ngày sinh không được để trống';
    } else {
      const birthDateValidation = isValidBirthDate(user.dayOfBirth);
      if (!birthDateValidation.isValid) {
        newErrors.dayOfBirth = birthDateValidation.message;
      }
    }

    if (!user.accountName) {
      newErrors.accountName = 'Tên tài khoản không được để trống';
    } else if (accountNameExists) {
      newErrors.accountName = 'Tên tài khoản đã tồn tại';
    }

    if (!userPassword) {
      newErrors.userPassword = 'Mật khẩu không được để trống';
    } else if (userPassword.length < 6) {
      newErrors.userPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!rePassword) {
      newErrors.rePassword = 'Xác nhận mật khẩu không được để trống';
    } else if (userPassword !== rePassword) {
      newErrors.rePassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const calculateMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/user')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Thêm người dùng mới
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Thông tin cá nhân */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin cá nhân
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Tên đầy đủ"
                        fullWidth
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        required
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        name="email"
                        value={user.email}
                        onChange={handleEmailChange}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Số điện thoại"
                        type="number"
                        fullWidth
                        name="phone"
                        value={user.phone}
                        onChange={handlePhoneChange}
                        required
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Địa chỉ"
                        fullWidth
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        name="dayOfBirth"
                        value={user.dayOfBirth}
                        onChange={handleChange}
                        required
                        error={!!errors.dayOfBirth}
                        helperText={errors.dayOfBirth}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          max: calculateMaxDate()
                        }}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Thông tin tài khoản */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin tài khoản
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Tên tài khoản"
                        fullWidth
                        name="accountName"
                        value={user.accountName}
                        onChange={handleAccountNameChange}
                        required
                        error={!!errors.accountName}
                        helperText={errors.accountName}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mật khẩu"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        name="userPassword"
                        value={userPassword}
                        onChange={handleDetailChange}
                        required
                        error={!!errors.userPassword}
                        helperText={errors.userPassword}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Xác nhận mật khẩu"
                        type={showRePassword ? "text" : "password"}
                        fullWidth
                        name="rePassword"
                        value={rePassword}
                        onChange={handleDetailChange}
                        required
                        error={!!errors.rePassword}
                        helperText={errors.rePassword}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowRePassword(!showRePassword)}
                                edge="end"
                              >
                                {showRePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* Validation Messages */}
            {(emailExists || phoneExists || accountNameExists) && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                {emailExists && <div>Email đã tồn tại trong hệ thống</div>}
                {phoneExists && <div>Số điện thoại đã tồn tại trong hệ thống</div>}
                {accountNameExists && <div>Tên tài khoản đã tồn tại trong hệ thống</div>}
              </Alert>
            )}

            {/* Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/user')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Lưu người dùng
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser;
