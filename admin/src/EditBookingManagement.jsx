import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditBookingManagement = () => {
  const { id } = useParams(); // Get booking ID from the URL
  const navigate = useNavigate();

  // Booking form state
  const [booking, setBooking] = useState({
    IDTOUR: '',
    IDNGUOIDUNG: '',
    NGAYDAT: '',
    SOVE_NGUOILON: 1,
    SOVE_TREM: 0,
    SOVE_EMBE: 0,
    TINHTRANG: 'Đã thanh toán', // Default status
    TONGTIEN: 0,
    PHUONGTHUCTHANHTOAN: 'Momo', // Default payment method
    GHICHU: ''
  });

  const [tourPrice, setTourPrice] = useState(0); // To store fetched tour price
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ticket data when the component loads if ID is not "new"
  useEffect(() => {
    if (id !== 'new') {
      fetchTicketData(id);
    }
  }, [id]);

  // Fetch ticket data from the server
  const fetchTicketData = async (ticketId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/tickets/${ticketId}`);
      if (!response.ok) {
        throw new Error('Error fetching ticket information');
      }

      const data = await response.json();
      setBooking({
        IDTOUR: data.IDTOUR || '',
        IDNGUOIDUNG: data.IDNGUOIDUNG || '',
        NGAYDAT: data.NGAYDAT ? data.NGAYDAT.slice(0, 10) : '',
        SOVE_NGUOILON: data.SOVE_NGUOILON || 1,
        SOVE_TREM: data.SOVE_TREM || 0,
        SOVE_EMBE: data.SOVE_EMBE || 0,
        TINHTRANG: data.TINHTRANG || 'Đã thanh toán',
        TONGTIEN: data.TONGTIEN || 0,
        PHUONGTHUCTHANHTOAN: data.PHUONGTHUCTHANHTOAN || 'Momo',
        GHICHU: data.GHICHU || ''
      });
      // Fetch the tour price for the existing booking
      fetchTourPrice(data.IDTOUR);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the tour price based on Tour ID
  const fetchTourPrice = async (tourId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/tours/${tourId}`);
      if (!response.ok) {
        throw new Error('Error fetching tour price');
      }

      const data = await response.json();
      setTourPrice(data.GIA || 0); // Set the fetched tour price
      calculateTotal(data.GIA); // Calculate total based on fetched price
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: value
    }));

    // If the Tour ID changes, fetch the tour price
    if (name === 'IDTOUR') {
      fetchTourPrice(value);
    }

    // Recalculate total money when ticket numbers change
    if (name === 'SOVE_NGUOILON' || name === 'SOVE_TREM' || name === 'SOVE_EMBE') {
      calculateTotal(tourPrice); // Use the fetched tour price
    }
  };

  // Calculate total money based on the number of tickets
  const calculateTotal = (fetchedPrice) => {
    const adultPrice = fetchedPrice; // Use fetched price for adults
    const childPrice = adultPrice * 0.8; // 80% for children
    const infantPrice = adultPrice * 0.5; // 50% for infants

    const total =
      (booking.SOVE_NGUOILON * adultPrice) +
      (booking.SOVE_TREM * childPrice) +
      (booking.SOVE_EMBE * infantPrice);

    setBooking((prev) => ({
      ...prev,
      TONGTIEN: total,
      SOVE: (parseInt(booking.SOVE_NGUOILON) + parseInt(booking.SOVE_TREM) + parseInt(booking.SOVE_EMBE))
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const requestUrl = id === 'new'
      ? 'http://localhost:5000/add-ticket'
      : `http://localhost:5000/update-ticket/${id}`;

    const method = id === 'new' ? 'POST' : 'PUT';

    try {
      const response = await fetch(requestUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${id === 'new' ? 'create' : 'update'} ticket`);
      }

      const result = await response.json();
      console.log(id === 'new' ? 'Ticket created:' : 'Ticket updated:', result);
      navigate('/ticket');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box padding={3}>
      <h3>{id === 'new' ? 'Thêm Đặt Chỗ' : 'Sửa Đặt Chỗ'}</h3>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {isLoading && <p>Loading...</p>}

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
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Số Vé Người Lớn"
          name="SOVE_NGUOILON"
          type="number"
          fullWidth
          value={booking.SOVE_NGUOILON}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0 }} // Prevent negative values
        />

        <TextField
          label="Số Vé Trẻ Em"
          name="SOVE_TREM"
          type="number"
          fullWidth
          value={booking.SOVE_TREM}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0 }} // Prevent negative values
        />

        <TextField
          label="Số Vé Em Bé"
          name="SOVE_EMBE"
          type="number"
          fullWidth
          value={booking.SOVE_EMBE}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0 }} // Prevent negative values
        />


        <TextField
          label="Tình Trạng"
          name="TINHTRANG"
          select
          fullWidth
          value={booking.TINHTRANG}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        >
          <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
          <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
          <MenuItem value="Đã hủy">Đã hủy</MenuItem>
        </TextField>

        <TextField
          label="Tổng Tiền (VNĐ)"
          name="TONGTIEN"
          type="number"
          fullWidth
          value={booking.TONGTIEN}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
          InputProps={{
            readOnly: true // Make it read-only since it is calculated
          }}
        />

        <TextField
          label="Phương Thức Thanh Toán"
          name="PHUONGTHUCTHANHTOAN"
          select
          fullWidth
          value={booking.PHUONGTHUCTHANHTOAN}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        >
          <MenuItem value="Visa">Visa</MenuItem>
          <MenuItem value="Momo">Momo</MenuItem>
          <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
        </TextField>

        <TextField
          label="Ghi Chú"
          name="GHICHU"
          fullWidth
          value={booking.GHICHU}
          onChange={handleChange}
          style={{ marginBottom: '10px' }}
        />

        <Button type="submit" variant="contained" color="primary" disabled={isLoading} style={{ marginRight: '10px' }}>
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
