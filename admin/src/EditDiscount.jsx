import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditDiscount = () => {
  const { id } = useParams(); // Get discount ID from the URL
  const navigate = useNavigate();

  // Discount form state
  const [discount, setDiscount] = useState({
    TENMGG: '',              // Discount Code
    DIEUKIEN: '',            // Condition/Description
    TILECHIETKHAU: 0,        // Discount Percentage
    NGAYHETHAN: '',          // Expiration Date
    TRANG_THAI: 'Còn hiệu lực', // Default status
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // State for validation errors

  // Fetch discount data when the component loads if ID is not "new"
  useEffect(() => {
    console.log(id);  // Debugging the id
    if (id !== 'new') {
      fetchDiscountData(id);
    }
  }, [id]);
  

  // Fetch discount data from the server
  const fetchDiscountData = async (discountId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/discount-codes/${discountId}`);
      if (!response.ok) {
        throw new Error('Error fetching discount information');
      }

      const data = await response.json();
      
      // Convert expiration date to local date format
      const localDate = new Date(data.NGAYHETHAN).toISOString().slice(0, 10);

      setDiscount({
        TENMGG: data.TENMGG || '',
        DIEUKIEN: data.DIEUKIEN || '',
        TILECHIETKHAU: data.TILECHIETKHAU || 0,
        NGAYHETHAN: localDate,
        TRANG_THAI: data.TRANG_THAI || 'Còn hiệu lực',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};

    if (!discount.TENMGG) {
      tempErrors.TENMGG = "Mã Giảm Giá không được để trống";
    }

    if (discount.TILECHIETKHAU < 0 || discount.TILECHIETKHAU > 100) {
      tempErrors.TILECHIETKHAU = "Phần Trăm Giảm phải từ 0 đến 100";
    }

    if (!discount.NGAYHETHAN) {
      tempErrors.NGAYHETHAN = "Ngày Hết Hạn không được để trống";
    } else {
      const selectedDate = new Date(discount.NGAYHETHAN);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        tempErrors.NGAYHETHAN = "Ngày Hết Hạn không thể là ngày trong quá khứ";
      }
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

    const requestUrl = id === 'new'
      ? 'http://localhost:5000/api/discount-codes'
      : `http://localhost:5000/api/discount-codes/${id}`;

    const method = id === 'new' ? 'POST' : 'PUT';

    try {
      const response = await fetch(requestUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(discount),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${id === 'new' ? 'create' : 'update'} discount: ${errorText}`);
      }

      const result = await response.json();
      console.log(id === 'new' ? 'Discount created:' : 'Discount updated:', result);
      navigate('/voucher');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box padding={3}>
      <h3>{id === 'new' ? 'Thêm Mã Giảm Giá' : 'Sửa Mã Giảm Giá'}</h3>

      {error && <Typography color="error">{error}</Typography>}
      {isLoading && <Typography>Loading...</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Mã Giảm Giá"
          name="TENMGG"
          fullWidth
          value={discount.TENMGG}
          onChange={handleChange}
          required
          error={!!errors.TENMGG}
          helperText={errors.TENMGG}
          style={{ marginBottom: '10px' }}
        />

        <TextField
          label="Điều Kiện"
          name="DIEUKIEN"
          fullWidth
          value={discount.DIEUKIEN}
          onChange={handleChange}
          style={{ marginBottom: '10px' }}
        />

        <TextField
          label="Phần Trăm Giảm (%)"
          name="TILECHIETKHAU"
          type="number"
          fullWidth
          value={discount.TILECHIETKHAU}
          onChange={handleChange}
          required
          error={!!errors.TILECHIETKHAU}
          helperText={errors.TILECHIETKHAU}
          style={{ marginBottom: '10px' }}
          inputProps={{ min: 0, max: 100 }}
        />

        <TextField
          label="Ngày Hết Hạn"
          name="NGAYHETHAN"
          type="date"
          fullWidth
          value={discount.NGAYHETHAN}
          onChange={handleChange}
          required
          error={!!errors.NGAYHETHAN}
          helperText={errors.NGAYHETHAN}
          style={{ marginBottom: '10px' }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Trạng Thái"
          name="TRANG_THAI"
          select
          fullWidth
          value={discount.TRANG_THAI}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        >
          <MenuItem value="Còn hiệu lực">Còn hiệu lực</MenuItem>
          <MenuItem value="Hết hiệu lực">Hết hiệu lực</MenuItem>
          <MenuItem value="Đã sử dụng">Đã sử dụng</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" color="primary" disabled={isLoading} style={{ marginRight: '10px' }}>
          {id === 'new' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/voucher')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default EditDiscount;
