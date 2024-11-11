import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography,
  Card, CardContent, Grid, IconButton, Paper,
  InputAdornment, Alert, Tooltip, Chip, Stack,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

    if (!Number.isInteger(Number(discount.TILECHIETKHAU))) {
      tempErrors.TILECHIETKHAU = "Phần Trăm Giảm phải là số nguyên";
    } else if (discount.TILECHIETKHAU <= 0 || discount.TILECHIETKHAU > 100) {
      tempErrors.TILECHIETKHAU = "Phần Trăm Giảm phải là số nguyên dương từ 1 đến 100";
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const applyDate = new Date(discount.NGAYAPDUNG);
    const expireDate = new Date(discount.NGAYHETHAN);

    if (!discount.NGAYAPDUNG) {
      tempErrors.NGAYAPDUNG = "Ngày Áp Dụng không được để trống";
    } else if (applyDate < currentDate) {
      tempErrors.NGAYAPDUNG = "Ngày Áp Dụng không được là ngày trong quá khứ";
    }

    if (!discount.NGAYHETHAN) {
      tempErrors.NGAYHETHAN = "Ngày Hết Hạn không được để trống";
    } else {
      if (expireDate < currentDate) {
        tempErrors.NGAYHETHAN = "Ngày Hết Hạn không được là ngày trong quá khứ";
      }
      if (expireDate < applyDate) {
        tempErrors.NGAYHETHAN = "Ngày Hết Hạn phải sau Ngày Áp Dụng";
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
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/voucher')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {id === 'new' ? 'Thêm Mã Giảm Giá Mới' : 'Chỉnh Sửa Mã Giảm Giá'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isLoading && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Đang xử lý...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Thông tin cơ bản */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin mã giảm giá
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Mã giảm giá"
                        name="TENMGG"
                        value={discount.TENMGG}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.TENMGG}
                        helperText={errors.TENMGG}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOfferIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phần trăm giảm (%)"
                        name="TILECHIETKHAU"
                        type="number"
                        value={discount.TILECHIETKHAU}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.TILECHIETKHAU}
                        helperText={errors.TILECHIETKHAU}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PercentIcon color="primary" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, max: 100 }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày áp dụng"
                        name="NGAYAPDUNG"
                        type="date"
                        value={discount.NGAYAPDUNG}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.NGAYAPDUNG}
                        helperText={errors.NGAYAPDUNG}
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
                        label="Ngày hết hạn"
                        name="NGAYHETHAN"
                        type="date"
                        value={discount.NGAYHETHAN}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.NGAYHETHAN}
                        helperText={errors.NGAYHETHAN}
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

                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Trạng thái"
                        name="TRANG_THAI"
                        value={discount.TRANG_THAI}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                      >
                        <MenuItem value="Còn hiệu lực">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <span>Còn hiệu lực</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="Hết hiệu lực">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CancelIcon color="error" />
                            <span>Hết hiệu lực</span>
                          </Box>
                        </MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Nội dung"
                        name="DIEUKIEN"
                        value={discount.DIEUKIEN}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/voucher')}
                startIcon={<CancelIcon />}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={<CheckCircleIcon />}
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

export default EditDiscount;
