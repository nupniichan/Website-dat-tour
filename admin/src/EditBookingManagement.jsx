import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography,
  Card, CardContent, Grid, IconButton, Paper,
  Divider, Autocomplete, InputAdornment, Alert,
  Chip, Stack, Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NoteIcon from '@mui/icons-material/Note';
import GroupIcon from '@mui/icons-material/Group';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';

// Thêm hàm helper để format giá
const formatToVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

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
  const [errors, setErrors] = useState({
    IDTOUR: '',
    IDNGUOIDUNG: '',
    NGAYDAT: '',
    SOVE_NGUOILON: '',
    SOVE_TREM: '',
    SOVE_EMBE: '',
    TINHTRANG: '',
    PHUONGTHUCTHANHTOAN: '',
  }); // New state for validation errors

  // Thêm state mới
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Thêm useEffect để lọc tours
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tours
        const toursResponse = await fetch('http://localhost:5000/tours');
        const toursData = await toursResponse.json();
        const validTours = toursData.filter(tour => tour.TRANGTHAI === 'Còn vé');
        setTours(validTours);

        // Fetch users
        const usersResponse = await fetch('http://localhost:5000/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // If editing existing ticket, set the selected tour and user
        if (id !== 'new' && booking.IDTOUR && booking.IDNGUOIDUNG) {
          const matchingTour = validTours.find(tour => tour.ID === booking.IDTOUR);
          const matchingUser = usersData.find(user => user.ID === booking.IDNGUOIDUNG);
          
          setSelectedTour(matchingTour || null);
          setSelectedUser(matchingUser || null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id, booking.IDTOUR, booking.IDNGUOIDUNG]);

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
      
      // Chuyển đổi ngày đặt từ UTC sang múi giờ địa phương
      const localDate = new Date(data.NGAYDAT).toISOString().slice(0, 10); 
  
      setBooking({
        IDTOUR: data.IDTOUR || '',
        IDNGUOIDUNG: data.IDNGUOIDUNG || '',
        NGAYDAT: localDate, // Gán ngày đã chuyển đổi vào booking
        SOVE_NGUOILON: data.SOVE_NGUOILON || 1,
        SOVE_TREM: data.SOVE_TREM || 0,
        SOVE_EMBE: data.SOVE_EMBE || 0,
        TINHTRANG: data.TINHTRANG || 'Đã thanh toán',
        TONGTIEN: data.TONGTIEN || 0,
        PHUONGTHUCTHANHTOAN: data.PHUONGTHUCTHANHTOAN || 'Momo',
        GHICHU: data.GHICHU || ''
      });
  
      // Tìm và set tour và user tương ứng
      const matchingTour = tours.find(tour => tour.ID === data.IDTOUR);
      const matchingUser = users.find(user => user.ID === data.IDNGUOIDUNG);
      
      if (matchingTour) setSelectedTour(matchingTour);
      if (matchingUser) setSelectedUser(matchingUser);

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
    setBooking(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate specific fields immediately
    if (name === 'SOVE_NGUOILON' || name === 'SOVE_TREM' || name === 'SOVE_EMBE') {
      const totalTickets = 
        parseInt(name === 'SOVE_NGUOILON' ? value : booking.SOVE_NGUOILON || 0) +
        parseInt(name === 'SOVE_TREM' ? value : booking.SOVE_TREM || 0) +
        parseInt(name === 'SOVE_EMBE' ? value : booking.SOVE_EMBE || 0);
      
      if (totalTickets > 10) {
        setErrors(prev => ({
          ...prev,
          [name]: "Tổng số vé không được vượt quá 10"
        }));
      }
    }
  };

  // Calculate total money based on the number of tickets
  const calculateTotal = (fetchedPrice) => {
    const adultPrice = fetchedPrice; // Use fetched price for adults
    const childPrice = adultPrice * 0.8; // 80% for children
    const infantPrice = adultPrice * 0.5; // 50% for infants

    const total =
      (parseInt(booking.SOVE_NGUOILON || 0) * adultPrice) +
      (parseInt(booking.SOVE_TREM || 0) * childPrice) +
      (parseInt(booking.SOVE_EMBE || 0) * infantPrice);

    setBooking((prev) => ({
      ...prev,
      TONGTIEN: total,
      SOVE: parseInt(booking.SOVE_NGUOILON || 0) + parseInt(booking.SOVE_TREM || 0) + parseInt(booking.SOVE_EMBE || 0)
    }));
  };

  // UseEffect to recalculate the total price when tickets or price change
  useEffect(() => {
    calculateTotal(tourPrice);
  }, [booking.SOVE_NGUOILON, booking.SOVE_TREM, booking.SOVE_EMBE, tourPrice]);

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};
    
    // Validate IDTOUR
    if (!booking.IDTOUR) {
      tempErrors.IDTOUR = "Mã Tour không được để trống";
    } else if (isNaN(booking.IDTOUR) || booking.IDTOUR <= 0) {
      tempErrors.IDTOUR = "Mã Tour phải là số nguyên dương";
    }

    // Validate IDNGUOIDUNG
    if (!booking.IDNGUOIDUNG) {
      tempErrors.IDNGUOIDUNG = "Mã Người Dùng không được để trống";
    } else if (isNaN(booking.IDNGUOIDUNG) || booking.IDNGUOIDUNG <= 0) {
      tempErrors.IDNGUOIDUNG = "Mã Người Dùng phải là số nguyên dương";
    }

    // Chỉ validate NGAYDAT khi thêm mới
    if (id === 'new') {
        if (!booking.NGAYDAT) {
            tempErrors.NGAYDAT = "Ngày Đặt không được để trống";
        } else {
            const selectedDate = new Date(booking.NGAYDAT);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Reset time part
            selectedDate.setHours(0, 0, 0, 0);
            
            if (selectedDate.getTime() !== currentDate.getTime()) {
                tempErrors.NGAYDAT = "Ngày Đặt phải là ngày hiện tại";
            }
        }
    }

    // Validate ticket numbers
    if (booking.SOVE_NGUOILON < 1) {
      tempErrors.SOVE_NGUOILON = "Phải có ít nhất 1 vé người lớn";
    }
    if (booking.SOVE_TREM < 0) {
      tempErrors.SOVE_TREM = "Số vé trẻ em không thể âm";
    }
    if (booking.SOVE_EMBE < 0) {
      tempErrors.SOVE_EMBE = "Số vé em bé không thể âm";
    }

    // Validate total tickets
    const totalTickets = parseInt(booking.SOVE_NGUOILON || 0) + 
                        parseInt(booking.SOVE_TREM || 0) + 
                        parseInt(booking.SOVE_EMBE || 0);
    if (totalTickets > 10) {
      tempErrors.SOVE_NGUOILON = "Tổng số vé không được vượt quá 10";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    setIsLoading(true);
    setError(null);

    // Điều chỉnh ngày đặt để tránh vấn đề múi giờ
    const bookingDate = new Date(booking.NGAYDAT);
    bookingDate.setHours(7, 0, 0, 0); // Set giờ là 7:00:00 để đảm bảo khi chuyển sang UTC không bị lùi ngày

    const updatedBooking = {
      ...booking,
      NGAYDAT: bookingDate.toISOString(), // Chuyển đổi sang ISO string
      IDTOUR: parseInt(booking.IDTOUR) || 0,
      IDNGUOIDUNG: parseInt(booking.IDNGUOIDUNG) || 0,
      SOVE_NGUOILON: parseInt(booking.SOVE_NGUOILON) || 0,
      SOVE_TREM: parseInt(booking.SOVE_TREM) || 0,
      SOVE_EMBE: parseInt(booking.SOVE_EMBE) || 0,
      SOVE: parseInt(booking.SOVE) || 0
    };

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
        body: JSON.stringify(updatedBooking) // Gửi booking với các giá trị số nguyên
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lấy chi tiết lỗi từ server
        throw new Error(`Failed to ${id === 'new' ? 'create' : 'update'} ticket: ${errorText}`);
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
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/ticket')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {id === 'new' ? 'Thêm Đặt Chỗ Mới' : 'Chỉnh Sửa Đặt Chỗ'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Thông tin Tour */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin Tour
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mã Tour"
                        name="IDTOUR"
                        value={booking.IDTOUR}
                        disabled
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={tours}
                        getOptionLabel={(option) => {
                          if (!option) return '';
                          return `${option.TENTOUR || ''} (${new Date(option.NGAYDI).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')})`;
                        }}
                        value={selectedTour}
                        onChange={(event, newValue) => {
                          setSelectedTour(newValue);
                          if (newValue) {
                            handleChange({
                              target: {
                                name: 'IDTOUR',
                                value: newValue.ID
                              }
                            });
                            fetchTourPrice(newValue.ID);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chọn Tour"
                            required
                            error={!!errors.IDTOUR}
                            helperText={errors.IDTOUR}
                            sx={{ bgcolor: 'white' }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="subtitle1">
                                {option.TENTOUR}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {`Khởi hành: ${new Date(option.NGAYDI).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {`Giá: ${formatToVND(option.GIA)}`}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Thông tin Khách hàng */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin Khách hàng
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mã Khách hàng"
                        name="IDNGUOIDUNG"
                        value={booking.IDNGUOIDUNG}
                        disabled
                        fullWidth
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
                      <Autocomplete
                        options={users}
                        getOptionLabel={(option) => option.FULLNAME || ''}
                        value={selectedUser}
                        onChange={(event, newValue) => {
                          setSelectedUser(newValue);
                          if (newValue) {
                            handleChange({
                              target: {
                                name: 'IDNGUOIDUNG',
                                value: newValue.ID
                              }
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chọn Khách hàng"
                            required
                            error={!!errors.IDNGUOIDUNG}
                            helperText={errors.IDNGUOIDUNG}
                            sx={{ bgcolor: 'white' }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="subtitle1">
                                {option.FULLNAME}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {`SĐT: ${option.PHONENUMBER}`}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Thông tin Đặt vé */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin Đặt vé
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày Đặt"
                        name="NGAYDAT"
                        type="date"
                        value={booking.NGAYDAT}
                        onChange={handleChange}
                        required
                        disabled={id !== 'new'}
                        fullWidth
                        error={!!errors.NGAYDAT}
                        helperText={errors.NGAYDAT}
                        InputLabelProps={{ shrink: true }}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Số Vé Người Lớn"
                        name="SOVE_NGUOILON"
                        type="number"
                        value={booking.SOVE_NGUOILON}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.SOVE_NGUOILON}
                        helperText={errors.SOVE_NGUOILON}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GroupIcon color="primary" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 1 }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Số Vé Trẻ Em"
                        name="SOVE_TREM"
                        type="number"
                        value={booking.SOVE_TREM}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.SOVE_TREM}
                        helperText={errors.SOVE_TREM}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ChildCareIcon color="primary" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Số Vé Em Bé"
                        name="SOVE_EMBE"
                        type="number"
                        value={booking.SOVE_EMBE}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.SOVE_EMBE}
                        helperText={errors.SOVE_EMBE}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BabyChangingStationIcon color="primary" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Thông tin Thanh toán */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin Thanh toán
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tình Trạng"
                        name="TINHTRANG"
                        select
                        value={booking.TINHTRANG}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                      >
                        <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                        <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                        <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                        <MenuItem value="Đã hoàn tiền">Đã hoàn tiền</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Phương Thức Thanh Toán"
                        name="PHUONGTHUCTHANHTOAN"
                        select
                        value={booking.PHUONGTHUCTHANHTOAN}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PaymentIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="VNPay">VNPay</MenuItem>
                        <MenuItem value="momo">Momo</MenuItem>
                        <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Tổng Tiền"
                        value={formatToVND(booking.TONGTIEN)}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoneyIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ 
                          bgcolor: '#f5f5f5',
                          '& .MuiInputBase-input': {
                            cursor: 'default',
                            color: 'text.primary',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Ghi Chú"
                        name="GHICHU"
                        multiline
                        rows={3}
                        value={booking.GHICHU}
                        onChange={handleChange}
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NoteIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Chi tiết giá */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                      Chi tiết giá
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        Người lớn: {formatToVND(tourPrice)} x {booking.SOVE_NGUOILON} = {formatToVND(tourPrice * booking.SOVE_NGUOILON)}
                      </Typography>
                      {booking.SOVE_TREM > 0 && (
                        <Typography variant="body2">
                          Trẻ em: {formatToVND(tourPrice * 0.8)} x {booking.SOVE_TREM} = {formatToVND(tourPrice * 0.8 * booking.SOVE_TREM)}
                        </Typography>
                      )}
                      {booking.SOVE_EMBE > 0 && (
                        <Typography variant="body2">
                          Em bé: {formatToVND(tourPrice * 0.5)} x {booking.SOVE_EMBE} = {formatToVND(tourPrice * 0.5 * booking.SOVE_EMBE)}
                        </Typography>
                      )}
                      <Divider />
                      <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                        Tổng cộng: {formatToVND(booking.TONGTIEN)}
                      </Typography>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/ticket')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : (id === 'new' ? 'Tạo mới' : 'Cập nhật')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditBookingManagement;
