import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Autocomplete, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

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
    // Fetch tours
    fetch('http://localhost:5000/tours')
        .then(res => res.json())
        .then(data => {
            // Chỉ lọc các tour còn vé
            const validTours = data.filter(tour => tour.TRANGTHAI === 'Còn vé');
            setTours(validTours);
            console.log('Fetched tours:', validTours); // Để debug
        })
        .catch(err => console.error('Error fetching tours:', err));

    // Fetch users
    fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Error fetching users:', err));
  }, []);

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
  
      // Set selected tour and user
      const foundTour = tours.find(tour => tour.ID === data.IDTOUR);
      const foundUser = users.find(user => user.ID === data.IDNGUOIDUNG);
      setSelectedTour(foundTour);
      setSelectedUser(foundUser);

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

    // Chuyển đổi các giá trị số thành số nguyên
    const updatedBooking = {
      ...booking,
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
    <Box padding={3}>
      <h3>{id === 'new' ? 'Thêm Đặt Chỗ' : 'Sửa Đặt Chỗ'}</h3>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {isLoading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Mã Tour"
              name="IDTOUR"
              value={booking.IDTOUR}
              disabled={true} // Khóa trường mã tour
              error={!!errors.IDTOUR}
              helperText={errors.IDTOUR}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={tours}
              getOptionLabel={(option) => {
                if (!option) return '';
                return `${option.TENTOUR || ''} (${new Date(option.NGAYDI).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')})`;
              }}
              value={selectedTour}
              onChange={(event, newValue) => {
                console.log('Selected tour:', newValue);
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
                  label="Tên Tour"
                  error={!!errors.IDTOUR}
                  helperText={errors.IDTOUR}
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography>
                      {option.TENTOUR}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {`Khởi hành: ${new Date(option.KHOIHANH).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {`Giá: ${formatToVND(option.GIA)}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.ID === value.ID;
              }}
              filterOptions={(options, { inputValue }) => {
                const searchValue = inputValue.toLowerCase();
                return options.filter(option => 
                  option.TENTOUR?.toLowerCase().includes(searchValue)
                ).slice(0, 10);
              }}
              noOptionsText="Không tìm thấy tour phù hợp"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Mã Người Dùng"
              name="IDNGUOIDUNG"
              value={booking.IDNGUOIDUNG}
              disabled={true} // Khóa trường mã người dùng
              error={!!errors.IDNGUOIDUNG}
              helperText={errors.IDNGUOIDUNG}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
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
                  label="Tên Người Dùng"
                  error={!!errors.IDNGUOIDUNG}
                  helperText={errors.IDNGUOIDUNG}
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography>
                      {option.FULLNAME}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {`SĐT: ${option.PHONENUMBER}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
              filterOptions={(options, { inputValue }) => {
                const searchValue = inputValue.toLowerCase();
                return options.filter(option => 
                  option.FULLNAME?.toLowerCase().includes(searchValue)
                ).slice(0, 10); // Giới hạn 10 kết quả
              }}
              noOptionsText="Không tìm thấy người dùng phù hợp"
            />
          </Grid>
        </Grid>

        <TextField
          label="Ngày Đặt"
          name="NGAYDAT"
          type="date"
          fullWidth
          value={booking.NGAYDAT}
          onChange={handleChange}
          required
          disabled={id !== 'new'} // Khóa trường nếu không phải là thêm mới
          error={!!errors.NGAYDAT}
          helperText={errors.NGAYDAT}
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
          error={!!errors.SOVE_NGUOILON}
          helperText={errors.SOVE_NGUOILON}
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Số Vé Trẻ Em"
          name="SOVE_TREM"
          type="number"
          fullWidth
          value={booking.SOVE_TREM}
          onChange={handleChange}
          required
          error={!!errors.SOVE_TREM}
          helperText={errors.SOVE_TREM}
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Số Vé Em Bé"
          name="SOVE_EMBE"
          type="number"
          fullWidth
          value={booking.SOVE_EMBE}
          onChange={handleChange}
          required
          error={!!errors.SOVE_EMBE}
          helperText={errors.SOVE_EMBE}
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0 }}
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
          <MenuItem value="Đã hoàn tiền">Đã hoàn tiền</MenuItem>
        </TextField>

        <TextField
          label="Tổng Tiền"
          name="TONGTIEN"
          fullWidth
          value={formatToVND(booking.TONGTIEN)}
          InputProps={{
            readOnly: true,
            startAdornment: (
                <InputAdornment position="start">
                    <Typography color="text.secondary">
                        Tổng cộng:
                    </Typography>
                </InputAdornment>
            ),
            style: { 
                backgroundColor: '#f5f5f5',  // Màu nền nhạt để thể hiện trường readonly
                cursor: 'default'            // Con trỏ mặc định thay vì text
            }
          }}
          sx={{ 
              mb: 2,
              '& .MuiInputBase-input': {
                  cursor: 'default',
                  color: 'text.primary',
                  WebkitTextFillColor: 'initial', // Fix cho Safari
                  '-webkit-opacity': '1'          // Fix cho Safari
              }
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
          <MenuItem value="VNPay">VNPay</MenuItem>
          <MenuItem value="momo">Momo</MenuItem>
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

        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Chi tiết giá:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Người lớn: ${formatToVND(tourPrice)} x ${booking.SOVE_NGUOILON} = ${formatToVND(tourPrice * booking.SOVE_NGUOILON)}`}
          </Typography>
          {booking.SOVE_TREM > 0 && (
            <Typography variant="body2" color="text.secondary">
              {`Trẻ em: ${formatToVND(tourPrice * 0.8)} x ${booking.SOVE_TREM} = ${formatToVND(tourPrice * 0.8 * booking.SOVE_TREM)}`}
            </Typography>
          )}
          {booking.SOVE_EMBE > 0 && (
            <Typography variant="body2" color="text.secondary">
              {`Em bé: ${formatToVND(tourPrice * 0.5)} x ${booking.SOVE_EMBE} = ${formatToVND(tourPrice * 0.5 * booking.SOVE_EMBE)}`}
            </Typography>
          )}
        </Box>

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
