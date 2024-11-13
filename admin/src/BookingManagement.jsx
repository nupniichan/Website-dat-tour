import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField, IconButton, Paper, Grid, Chip, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TourIcon from '@mui/icons-material/Tour';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
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
    setPage(1); // Reset to first page when search term changes
  }, [searchTerm, bookings]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
          {currentBookings.map((booking) => (
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

      {/* Add pagination component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination 
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton 
          showLastButton
        />
      </Box>

      {/* Booking details dialog */}
      {selectedBooking && (
        <Dialog 
          open={true} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleCloseDialog} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6">Chi tiết đặt chỗ #{selectedBooking.ID}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              {/* Section: Tour Information */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TourIcon /> Thông tin Tour
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Mã Tour</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedBooking.IDTOUR}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tình trạng</Typography>
                    <Chip 
                      label={selectedBooking.TINHTRANG}
                      color={selectedBooking.TINHTRANG === 'Đã thanh toán' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Section: Customer Information */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Thông tin khách hàng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Tên khách hàng</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedBooking.FULLNAME}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Ngày đặt</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {new Date(selectedBooking.NGAYDAT).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Section: Ticket Information */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ConfirmationNumberIcon /> Thông tin vé
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Số vé</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedBooking.SOVE}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tổng tiền</Typography>
                    <Typography variant="h6" color="error" fontWeight="bold">
                      {formatCurrency(selectedBooking.TONGTIEN)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Additional Information (if any) */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon /> Ghi chú
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  border: '1px dashed rgba(0, 0, 0, 0.12)'
                }}>
                </Box>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default BookingManagement;
