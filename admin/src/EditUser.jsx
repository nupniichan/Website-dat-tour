import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Card, CardContent,
  Grid, Paper, IconButton, InputAdornment, Alert,
  Tooltip, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    FULLNAME: '',
    PHONENUMBER: '',
    EMAIL: '',
    ADDRESS: '',
    DAYOFBIRTH: '',
    ACCOUNTNAME: '',
  });

  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [accountNameExists, setAccountNameExists] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/user/${id}`)
      .then(response => response.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error('Lỗi khi lấy thông tin người dùng:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === 'EMAIL') {
      if (value) {
        checkEmailExists(value);
      } else {
        setEmailExists(false);
      }
    }

    if (name === 'PHONENUMBER') {
      if (value) {
        checkPhoneExists(value);
      } else {
        setPhoneExists(false);
      }
    }

    if (name === 'ACCOUNTNAME') {
      if (value) {
        checkAccountNameExists(value);
      } else {
        setAccountNameExists(false);
      }
    }
  };

  const checkEmailExists = (email) => {
    fetch('http://localhost:5000/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 409) {
          setEmailExists(true);
        }
      })
      .catch(err => console.error('Lỗi khi kiểm tra email:', err));
  };

  const checkPhoneExists = (phone) => {
    fetch('http://localhost:5000/check-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 409) {
          setPhoneExists(true);
        }
      })
      .catch(err => console.error('Lỗi khi kiểm tra số điện thoại:', err));
  };

  const checkAccountNameExists = (accountName) => {
    fetch('http://localhost:5000/check-accountname', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountName }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 409) {
          setAccountNameExists(true);
        }
      })
      .catch(err => console.error('Lỗi khi kiểm tra tên tài khoản:', err));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.FULLNAME) {
      newErrors.FULLNAME = 'Tên đầy đủ không được để trống';
    } else if (!/\s/.test(user.FULLNAME)) {
      newErrors.FULLNAME = 'Tên đầy đủ phải có ít nhất một khoảng trắng';
    }
    if (!user.PHONENUMBER) newErrors.PHONENUMBER = 'Số điện thoại không được để trống';
    if (!user.EMAIL) newErrors.EMAIL = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(user.EMAIL)) newErrors.EMAIL = 'Email không hợp lệ';
    if (!user.DAYOFBIRTH) newErrors.DAYOFBIRTH = 'Ngày sinh không được để trống';
    if (!user.ACCOUNTNAME) newErrors.ACCOUNTNAME = 'Tên tài khoản không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (emailExists || phoneExists || accountNameExists) {
      return;
    }

    fetch(`http://localhost:5000/edit-user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => {
        if (response.ok) {
          alert('Cập nhật thông tin thành công!');
          navigate('/user');
        } else {
          throw new Error('Có lỗi xảy ra khi cập nhật thông tin người dùng');
        }
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật thông tin người dùng:', err);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      });
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
              Chỉnh sửa thông tin người dùng
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
                        name="FULLNAME"
                        value={user.FULLNAME}
                        onChange={handleChange}
                        required
                        error={!!errors.FULLNAME}
                        helperText={errors.FULLNAME}
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
                        name="EMAIL"
                        value={user.EMAIL}
                        onChange={handleChange}
                        required
                        error={!!errors.EMAIL}
                        helperText={errors.EMAIL}
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
                        fullWidth
                        name="PHONENUMBER"
                        value={user.PHONENUMBER}
                        onChange={handleChange}
                        required
                        error={!!errors.PHONENUMBER}
                        helperText={errors.PHONENUMBER}
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
                        name="ADDRESS"
                        value={user.ADDRESS}
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
                        name="DAYOFBIRTH"
                        value={user.DAYOFBIRTH ? user.DAYOFBIRTH.split('T')[0] : ''}
                        onChange={handleChange}
                        required
                        error={!!errors.DAYOFBIRTH}
                        helperText={errors.DAYOFBIRTH}
                        InputLabelProps={{ shrink: true }}
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
                        name="ACCOUNTNAME"
                        value={user.ACCOUNTNAME}
                        onChange={handleChange}
                        required
                        error={!!errors.ACCOUNTNAME}
                        helperText={errors.ACCOUNTNAME}
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
                Lưu thay đổi
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditUser;