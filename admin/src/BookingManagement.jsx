import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  // Fetch bookings from the backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch('http://localhost:5000/bookings')
      .then(response => response.json())
      .then(data => {
        setBookings(data);
        setFilteredBookings(data);
      })
      .catch(err => console.error('Error fetching bookings:', err));
  };

  // Filter bookings based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredBookings(bookings.filter(booking =>
        booking.ID.toString().includes(searchTerm) ||
        booking.IDTOUR.toString().includes(searchTerm)
      ));
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  // Navigate to add booking page
  const handleAddBookingClick = () => {
    navigate('/edit-ticket/new');
  };

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/edit-ticket/${id}`);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá đặt chỗ này không?')) {
      fetch(`http://localhost:5000/delete-booking/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error deleting booking');
        }
      })
      .then(data => {
        fetchBookings(); // Cập nhật lại danh sách đặt chỗ
      })
      .catch(err => console.error('Error deleting booking:', err));
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý đặt chỗ</h3>

      <Button variant="contained" style={{ backgroundColor: '#FFA500', color: 'white' }} onClick={handleAddBookingClick}>
        Thêm đặt chỗ
      </Button>

      {/* Search input */}
      <TextField
        label="Tìm kiếm theo mã ID hoặc mã Tour"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Mã Tour</TableCell>
            <TableCell>Mã Người Dùng</TableCell>
            <TableCell>Ngày Đặt</TableCell>
            <TableCell>Số Vé</TableCell>
            <TableCell>Tình Trạng</TableCell>
            <TableCell>Tổng Tiền</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.ID}>
              <TableCell>{booking.ID}</TableCell>
              <TableCell>{booking.IDTOUR}</TableCell>
              <TableCell>{booking.IDNGUOIDUNG}</TableCell>
              <TableCell>{new Date(booking.NGAYDAT).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{booking.SOVE}</TableCell>
              <TableCell>{booking.TINHTRANG}</TableCell>
              <TableCell>{booking.TONGTIEN.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined" 
                  onClick={() => handleEdit(booking.ID)} 
                >
                  Sửa
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => handleDelete(booking.ID)} 
                  style={{ marginLeft: '10px' }}
                >
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedBooking && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết đặt chỗ</DialogTitle>
          <DialogContent>
            <Typography>Mã đặt chỗ: {selectedBooking.ID}</Typography>
            <Typography>Mã Tour: {selectedBooking.IDTOUR}</Typography>
            <Typography>Mã Người Dùng: {selectedBooking.IDNGUOIDUNG}</Typography>
            <Typography>Ngày đặt: {new Date(selectedBooking.NGAYDAT).toLocaleDateString('vi-VN')}</Typography>
            <Typography>Số vé: {selectedBooking.SOVE}</Typography>
            <Typography>Tình trạng: {selectedBooking.TINHTRANG}</Typography>
            <Typography>Tổng tiền: {selectedBooking.TONGTIEN.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default BookingManagement;
