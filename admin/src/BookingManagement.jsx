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
    fetch('http://localhost:5000/tickets')
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
      setFilteredBookings(
        bookings.filter((booking) =>
          booking.ID.toString().includes(searchTerm) ||
          booking.IDTOUR.toString().includes(searchTerm)
        )
      );
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
      fetch(`http://localhost:5000/delete-ticket/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting booking');
          }
        })
        .then(() => {
          fetchBookings(); // Refresh the list after deletion
        })
        .catch((err) => console.error('Error deleting booking:', err));
    }
  };

  // Handle view details button click
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  // Helper function to format currency with commas and "đ" at the end, without decimals
  const formatCurrency = (amount) => {
    return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
  };

  return (
    <Box padding={3}>
      <h3>Quản lý đặt chỗ</h3>

      <Button
        variant="contained"
        style={{ backgroundColor: '#FFA500', color: 'white', marginBottom: '15px' }}
        onClick={handleAddBookingClick}
      >
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
            <TableCell>Tên Khách Hàng</TableCell>
            <TableCell>Ngày Đặt</TableCell>
            <TableCell>Số Vé</TableCell>
            <TableCell>Tình Trạng</TableCell>
            <TableCell>Tổng Tiền (VNĐ)</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.ID}>
              <TableCell>{booking.ID}</TableCell>
              <TableCell>{booking.IDTOUR}</TableCell>
              <TableCell>{booking.FULLNAME}</TableCell>
              <TableCell>{new Date(booking.NGAYDAT).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{booking.SOVE}</TableCell>
              <TableCell>{booking.TINHTRANG}</TableCell>
              <TableCell>{formatCurrency(booking.TONGTIEN)}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleViewDetails(booking)}>
                  Xem Chi tiết
                </Button>
                <Button variant="outlined" onClick={() => handleEdit(booking.ID)} style={{ marginLeft: '10px' }}>
                  Sửa
                </Button>
                <Button variant="outlined" onClick={() => handleDelete(booking.ID)} style={{ marginLeft: '10px' }}>
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Booking details dialog */}
      {selectedBooking && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết đặt chỗ</DialogTitle>
          <DialogContent>
            <Box padding={2}>
              {/* Section: Booking Information */}
              <Typography variant="h6" gutterBottom>
                Thông tin đặt chỗ
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>Mã đặt chỗ: <strong>{selectedBooking.ID}</strong></Typography>
                <Typography>Mã Tour: <strong>{selectedBooking.IDTOUR}</strong></Typography>
                <Typography>Tên Người Dùng: <strong>{selectedBooking.FULLNAME}</strong></Typography>
                <Typography>Ngày đặt: <strong>{new Date(selectedBooking.NGAYDAT).toLocaleDateString('vi-VN')}</strong></Typography>
              </Box>

              {/* Section: Ticket Information */}
              <Typography variant="h6" gutterBottom>
                Thông tin vé
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>Số vé: <strong>{selectedBooking.SOVE}</strong></Typography>
                <Typography>Tình trạng: <strong>{selectedBooking.TINHTRANG}</strong></Typography>
              </Box>

              {/* Section: Payment Information */}
              <Typography variant="h6" gutterBottom>
                Thanh toán
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>
                  Tổng tiền: <Typography component="span" variant="body1" color="error" fontWeight="bold">
                    {formatCurrency(selectedBooking.TONGTIEN)}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default BookingManagement;
