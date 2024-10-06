import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditBookingManagement = () => {
  const { id } = useParams(); // Lấy ID đặt chỗ từ URL
  const [booking, setBooking] = useState({
    IDTOUR: '',
    IDNGUOIDUNG: '',
    NGAYDAT: '',
    SOVE: 1,
    TINHTRANG: '',
    TONGTIEN: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== 'new') {
      // Nếu không phải tạo mới, lấy dữ liệu đặt chỗ từ server
      fetch(`http://localhost:5000/bookings/${id}`)
        .then(response => response.json())
        .then(data => {
          // Thiết lập dữ liệu booking từ dữ liệu lấy được
          setBooking({
            IDTOUR: data.IDTOUR || '',
            IDNGUOIDUNG: data.IDNGUOIDUNG || '',
            NGAYDAT: data.NGAYDAT ? data.NGAYDAT.slice(0, 10) : '',
            SOVE: data.SOVE || 1,
            TINHTRANG: data.TINHTRANG || '',
            TONGTIEN: data.TONGTIEN || 0,
          });
        })
        .catch(err => console.error('Error fetching booking:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestUrl = id === 'new' 
      ? 'http://localhost:5000/create-booking' // API tạo mới
      : `http://localhost:5000/update-booking/${id}`; // API cập nhật
    
    const method = id === 'new' ? 'POST' : 'PUT'; // Phương thức POST cho tạo mới, PUT cho cập nhật

    fetch(requestUrl, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    })
      .then(response => response.json())
      .then(data => {
        console.log(id === 'new' ? 'Booking created:' : 'Booking updated:', data);
        navigate('/ticket');
      })
      .catch(err => console.error('Error saving booking:', err));
  };

  return (
    <Box padding={3}>
      <h3>{id === 'new' ? 'Thêm Đặt Chỗ' : 'Sửa Đặt Chỗ'}</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Mã Tour"
          name="IDTOUR"
          fullWidth
          value={booking.IDTOUR}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Mã Người Dùng"
          name="IDNGUOIDUNG"
          fullWidth
          value={booking.IDNGUOIDUNG}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
            label="Ngày Đặt"
            name="NGAYDAT"
            type="date"
            fullWidth
            value={booking.NGAYDAT}
            onChange={handleChange}
            required
            style={{ marginBottom: '10px' }}
            InputLabelProps={{ shrink: true }}  // Đảm bảo nhãn không bị đè
        />

        <TextField
          label="Số Vé"
          name="SOVE"
          type="number"
          fullWidth
          value={booking.SOVE}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Tình Trạng"
          name="TINHTRANG"
          fullWidth
          value={booking.TINHTRANG}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Tổng Tiền"
          name="TONGTIEN"
          type="number"
          fullWidth
          value={booking.TONGTIEN}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
          {id === 'new' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/ticket')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default EditBookingManagement;
