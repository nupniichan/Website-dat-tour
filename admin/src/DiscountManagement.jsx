import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, Typography, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const navigate = useNavigate();
  const [errors, setError] = useState({}); // State for validation errors
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
  }, [searchTerm, discounts]);

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
            <TableCell>Điều kiện</TableCell>
            <TableCell>Tỉ lệ chiết khấu (%)</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDiscounts.map((discount) => (
            <TableRow key={discount.IDMAGIAMGIA}>
              <TableCell>{discount.IDMAGIAMGIA}</TableCell>
              <TableCell>{discount.TENMGG}</TableCell>
              <TableCell>{new Date(discount.NGAYAPDUNG).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{new Date(discount.NGAYHETHAN).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{discount.DIEUKIEN}</TableCell>
              <TableCell>{discount.TILECHIETKHAU}</TableCell>
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

      {/* Discount details dialog */}
      {selectedDiscount && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
          <DialogContent>
            <Box padding={2}>
              <Typography variant="h6" gutterBottom>
                Thông tin mã giảm giá
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>Mã giảm giá: <strong>{selectedDiscount.IDMAGIAMGIA}</strong></Typography>
                <Typography>Tên mã giảm giá: <strong>{selectedDiscount.TENMGG}</strong></Typography>
                <Typography>Ngày áp dụng: <strong>{new Date(selectedDiscount.NGAYAPDUNG).toLocaleDateString('vi-VN')}</strong></Typography>
                <Typography>Ngày hết hạn: <strong>{new Date(selectedDiscount.NGAYHETHAN).toLocaleDateString('vi-VN')}</strong></Typography>
                <Typography>Điều kiện: <strong>{selectedDiscount.DIEUKIEN}</strong></Typography>
                <Typography>Tỉ lệ chiết khấu: <strong>{selectedDiscount.TILECHIETKHAU}%</strong></Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default DiscountManagement;
