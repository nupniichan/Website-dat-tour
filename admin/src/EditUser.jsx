import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false); // Biến để theo dõi số điện thoại tồn tại
  const [accountNameExists, setAccountNameExists] = useState(false); // Biến để theo dõi tên tài khoản tồn tại

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

    // Kiểm tra số điện thoại đã tồn tại khi người dùng nhập số điện thoại
    if (name === 'PHONENUMBER') {
      if (value) {
        checkPhoneExists(value);
      } else {
        setPhoneExists(false);
      }
    }

    // Kiểm tra tên tài khoản đã tồn tại khi người dùng nhập tên tài khoản
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
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 409) {
            setEmailExists(true);
        } else if (response.status === 400) {
            setSnackbarMessage('Email không được cung cấp.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    })
    .catch((err) => {
        console.error('Lỗi khi kiểm tra email:', err);
    });
  };

  const checkPhoneExists = (phone) => {
    fetch('http://localhost:5000/check-phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 409) {
        setPhoneExists(true);
      }
    })
    .catch((err) => {
      console.error('Lỗi khi kiểm tra số điện thoại:', err);
    });
  };

  const checkAccountNameExists = (accountName) => {
    fetch('http://localhost:5000/check-accountname', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountName }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 409) {
        setAccountNameExists(true);
      }
    })
    .catch((err) => {
      console.error('Lỗi khi kiểm tra tên tài khoản:', err);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.FULLNAME || !user.PHONENUMBER || !user.EMAIL  || !user.DAYOFBIRTH || !user.ACCOUNTNAME) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (user.PHONENUMBER.length !== 10) {
      setSnackbarMessage('Số điện thoại phải đủ 10 số.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (!user.EMAIL.includes('@gmail.com')) {
      setSnackbarMessage('Email phải có ký tự @gmail.com.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (!user.FULLNAME.includes(' ')) {
      setSnackbarMessage('Tên đầy đủ phải có ít nhất một khoảng cách.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Kiểm tra nếu email, số điện thoại, hoặc tên tài khoản đã tồn tại
    if (emailExists) {
      setSnackbarMessage('Email đã tồn tại. Lỗi nhập dữ liệu.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (phoneExists) {
      setSnackbarMessage('Số điện thoại đã tồn tại. Lỗi nhập dữ liệu.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (accountNameExists) {
      setSnackbarMessage('Tên tài khoản đã tồn tại. Lỗi nhập dữ liệu.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    fetch(`http://localhost:5000/edit-user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          setSnackbarMessage('Cập nhật thông tin thành công!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          navigate('/user');
        } else {
          throw new Error('Có lỗi xảy ra khi cập nhật thông tin người dùng');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật thông tin người dùng:', err);
        setSnackbarMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formatDateToISODateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDateToISODateOnly(user.DAYOFBIRTH);

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Chỉnh sửa thông tin người dùng
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên đầy đủ"
          name="FULLNAME"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.FULLNAME}
          onChange={handleChange}
          InputLabelProps={{ style: { color: 'red' } }}
          required
        />
        <TextField
          label="Số điện thoại"
          name="PHONENUMBER"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.PHONENUMBER}
          onChange={handleChange}
          InputLabelProps={{ style: { color: 'red' } }}
          required
        />
        <TextField
          label="Email"
          name="EMAIL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.EMAIL}
          onChange={handleChange}
          InputLabelProps={{ style: { color: 'red' } }}
          required
        />
        <TextField
          label="Địa chỉ"
          name="ADDRESS"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.ADDRESS}
          onChange={handleChange}
        />
        <TextField
          label="Ngày sinh"
          name="DAYOFBIRTH"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={formattedDate}
          onChange={handleChange}
          InputLabelProps={{ style: { color: 'red' } }}
          required
        />
        <TextField
          label="Tên tài khoản"
          name="ACCOUNTNAME"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.ACCOUNTNAME}
          onChange={handleChange}
          InputLabelProps={{ style: { color: 'red' } }}
          required
        />

        <Box marginTop={2}>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#FFA500', color: 'white' }}
          >
            Lưu thay đổi
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: '10px' }}
            onClick={() => navigate('/user')}
          >
            Hủy
          </Button>
        </Box>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditUser;
