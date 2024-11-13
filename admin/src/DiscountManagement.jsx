import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, Typography, TextField,
  Paper,
  Grid,
  IconButton,
  Chip,
  Divider,
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalOffer,
  CalendarToday,
  Description,
  PercentOutlined,
  ArrowBack,
  AccessTime,
  Info
} from '@mui/icons-material';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const navigate = useNavigate();
  const [errors, setError] = useState({}); // State for validation errors
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Fetch discounts from the backend
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/discount-codes'); // Updated URL
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
    }
  };

  // Filter discounts based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredDiscounts(
        discounts.filter((discount) =>
          discount.IDMAGIAMGIA.toString().includes(searchTerm) ||
          discount.TENMGG.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredDiscounts(discounts);
    }
    setPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm, discounts]);

  // Tính toán các giá trị cho phân trang
  const totalPages = Math.ceil(filteredDiscounts.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDiscounts = filteredDiscounts.slice(startIndex, endIndex);

  // Xử lý khi thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Navigate to add discount page
  const handleAddDiscountClick = () => {
    navigate('/edit-voucher/new');
  };

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/edit-voucher/${id}`);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá mã giảm giá này không?')) {
      fetch(`http://localhost:5000/discount-codes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            fetchDiscounts(); // Refresh the list after deletion
          } else {
            throw new Error('Error deleting discount code');
          }
        })
        .catch((err) => console.error('Error deleting discount code:', err));
    }
  };

  // Handle view details button click
  const handleViewDetails = (discount) => {
    setSelectedDiscount(discount);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedDiscount(null);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý mã giảm giá</h3>

      <Button
        variant="contained"
        style={{ backgroundColor: '#FFA500', color: 'white', marginBottom: '15px' }}
        onClick={handleAddDiscountClick}
      >
        Thêm mã giảm giá
      </Button>

      {/* Search input */}
      <TextField
        label="Tìm kiếm theo mã ID hoặc tên mã giảm giá"
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
            <TableCell>Tên mã giảm giá</TableCell>
            <TableCell>Ngày áp dụng</TableCell>
            <TableCell>Ngày hết hạn</TableCell>
            <TableCell>Tỉ lệ chiết khấu (%)</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentDiscounts.map((discount) => (
            <TableRow key={discount.IDMAGIAMGIA}>
              <TableCell>{discount.IDMAGIAMGIA}</TableCell>
              <TableCell>{discount.TENMGG}</TableCell>
              <TableCell>{new Date(discount.NGAYAPDUNG).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{new Date(discount.NGAYHETHAN).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{discount.TILECHIETKHAU} %</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleViewDetails(discount)}>
                  Xem Chi tiết
                </Button>
                <Button variant="outlined" onClick={() => handleEdit(discount.IDMAGIAMGIA)} style={{ marginLeft: '10px' }}>
                  Sửa
                </Button>
                <Button variant="outlined" onClick={() => handleDelete(discount.IDMAGIAMGIA)} style={{ marginLeft: '10px' }}>
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Thêm component phân trang */}
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

      {/* Discount details dialog */}
      {selectedDiscount && (
        <Dialog 
          open={true} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleCloseDialog} size="small">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6">Chi tiết mã giảm giá</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              {/* Thông tin cơ bản */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOffer /> Thông tin mã giảm giá
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {selectedDiscount.TENMGG}
                      </Typography>
                      <Chip 
                        label={new Date(selectedDiscount.NGAYHETHAN) > new Date() ? "Còn hiệu lực" : "Hết hiệu lực"}
                        color={new Date(selectedDiscount.NGAYHETHAN) > new Date() ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mã giảm giá: <strong>{selectedDiscount.IDMAGIAMGIA}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Thời gian áp dụng */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime /> Thời gian áp dụng
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Ngày bắt đầu</Typography>
                        <Typography variant="body1">
                          {new Date(selectedDiscount.NGAYAPDUNG).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Ngày kết thúc</Typography>
                        <Typography variant="body1">
                          {new Date(selectedDiscount.NGAYHETHAN).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Thông tin chi tiết */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info /> Thông tin chi tiết
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 2,
                      borderRadius: 1
                    }}>
                      <PercentOutlined fontSize="large" />
                      <Box>
                        <Typography variant="overline">Tỉ lệ chiết khấu</Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {selectedDiscount.TILECHIETKHAU}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Nội dung mã giảm giá
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.paper',
                          border: '1px dashed rgba(0, 0, 0, 0.12)'
                        }}
                      >
                        <Typography variant="body1">
                          {selectedDiscount.DIEUKIEN || 'Không có nội dung mã giảm giá'}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default DiscountManagement;
