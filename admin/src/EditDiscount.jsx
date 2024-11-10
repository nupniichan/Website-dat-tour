import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [discount, setDiscount] = useState({
    TENMGG: '',              // Discount Code
    DIEUKIEN: '',            // Condition/Description
    TILECHIETKHAU: 0,        // Discount Percentage
    NGAYAPDUNG: '',          // Application Date
    NGAYHETHAN: '',          // Expiration Date
    TRANG_THAI: 'Còn hiệu lực',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id !== 'new') {
      fetchDiscountData(id);
    }
  }, [id]);

  const fetchDiscountData = async (discountId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/discount-codes/${discountId}`);
      if (!response.ok) {
        throw new Error('Error fetching discount information');
      }

      const data = await response.json();
      
      const localNgayApDung = new Date(data.NGAYAPDUNG).toISOString().slice(0, 10);
      const localNgayHetHan = new Date(data.NGAYHETHAN).toISOString().slice(0, 10);

      setDiscount({
        TENMGG: data.TENMGG || '',
        DIEUKIEN: data.DIEUKIEN || '',
        TILECHIETKHAU: data.TILECHIETKHAU || 0,
        NGAYAPDUNG: localNgayApDung,
        NGAYHETHAN: localNgayHetHan,
        TRANG_THAI: data.TRANG_THAI || 'Còn hiệu lực',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!discount.TENMGG) {
      tempErrors.TENMGG = "Mã Giảm Giá không được để trống";
    }

    if (discount.TILECHIETKHAU < 0 || discount.TILECHIETKHAU > 100) {
      tempErrors.TILECHIETKHAU = "Phần Trăm Giảm phải từ 0 đến 100";
    }

    if (!discount.NGAYAPDUNG) {
      tempErrors.NGAYAPDUNG = "Ngày Áp Dụng không được để trống";
    } else {
      const applyDate = new Date(discount.NGAYAPDUNG);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset current time to midnight for accurate comparison
      if (applyDate < currentDate) {
        tempErrors.NGAYAPDUNG = "Ngày Áp Dụng phải là hôm nay hoặc ngày trong tương lai";
      }
    }

    if (!discount.NGAYHETHAN) {
      tempErrors.NGAYHETHAN = "Ngày Hết Hạn không được để trống";
    } else {
      const selectedDate = new Date(discount.NGAYHETHAN);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        tempErrors.NGAYHETHAN = "Ngày Hết Hạn phải là hôm nay hoặc ngày trong tương lai";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
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
          label="Ngày Áp Dụng"
          name="NGAYAPDUNG"
          type="date"
          fullWidth
          value={discount.NGAYAPDUNG}
          onChange={handleChange}
          required
          error={!!errors.NGAYAPDUNG}
          helperText={errors.NGAYAPDUNG}
          style={{ marginBottom: '10px' }}
          InputLabelProps={{ shrink: true }}
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
