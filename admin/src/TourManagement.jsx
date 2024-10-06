import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  MenuItem,
  Menu,
  IconButton,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TourManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [tours, setTours] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
    fetchSchedules();
  }, []);

  const fetchTours = () => {
    fetch('http://localhost:5000/tours')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched tours:', data); // Log fetched data
        setTours(data);
      })
      .catch(err => console.error('Error fetching tours:', err));
  };

  const fetchSchedules = () => {
    fetch('http://localhost:5000/schedules')
      .then(response => response.json())
      .then(data => setSchedules(data))
      .catch(err => console.error('Error fetching schedules:', err));
  };

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
  };

  const handleCloseDialog = () => {
    setSelectedTour(null);
  };

  const handleAddTour = () => {
    navigate('/add-tour');
  };

  const handleEdit = (tour) => {
    navigate(`/edit-tour/${tour.ID}`, { state: { tour } });
};

  const handleDelete = (id) => {
  if (window.confirm('Bạn có chắc chắn muốn xoá tour này không?')) {
      fetch(`http://localhost:5000/delete-tour/${id}`, {
          method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
          console.log(data.message);
          fetchTours(); // Tải lại danh sách tour
      })
      .catch(err => console.error('Error deleting tour:', err));
  }
};
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

  const filteredTours = tours.filter(tour => 
    tour.TENTOUR.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || tour.TRANGTHAI === statusFilter)
  );

  console.log('Filtered tours:', filteredTours); // Log filtered tours

  return (
    <>
      <Box padding={3}>
      <h3>Quản lý tour</h3>
        <TextField
          label="Tìm kiếm tour"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
        <Box display="flex" gap={2} marginBottom={2}>
          <Box>
            <IconButton onClick={(event) => setStatusAnchorEl(event.currentTarget)} aria-controls={statusAnchorEl ? 'status-menu' : undefined}>
              Trạng thái tour {statusAnchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
            <Menu
              id="status-menu"
              anchorEl={statusAnchorEl}
              open={Boolean(statusAnchorEl)}
              onClose={() => setStatusAnchorEl(null)}
            >
              <MenuItem onClick={() => setStatusFilter('')}>Tất cả</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Còn vé')}>Còn vé</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Đã hết vé')}>Đã hết vé</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Box marginBottom={2}>
          <Button  variant="contained" style={{ backgroundColor: '#FFA500', color: 'white' }} onClick={handleAddTour}>
            Thêm tour mới
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên tour</TableCell>
              <TableCell>Số vé</TableCell>
              <TableCell>Giá (VNĐ)</TableCell>
              <TableCell>Ngày đi</TableCell>
              <TableCell>Ngày về</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTours.map((tour) => (
              <TableRow key={tour.ID}>
                <TableCell>{tour.TENTOUR}</TableCell>
                <TableCell>{tour.SOVE}</TableCell>
                <TableCell>{tour.GIA ? parseFloat(tour.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}</TableCell>
                <TableCell>{formatDate(tour.NGAYDI)}</TableCell>
                <TableCell>{formatDate(tour.NGAYVE)}</TableCell>
                <TableCell>{tour.TRANGTHAI}</TableCell>
            <TableCell>
                <Button variant="outlined"  onClick={() => handleViewDetails(tour)}>Xem chi tiết</Button>
                <Button variant="outlined" onClick={() => handleEdit(tour)} style={{ marginLeft: '10px' }}>Sửa</Button>
                <Button variant="outlined" onClick={() => handleDelete(tour.ID)} style={{ marginLeft: '10px' }}>Xoá</Button>
            </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
                {selectedTour && (
          <Dialog open={true} onClose={handleCloseDialog}>
            <DialogTitle>Chi tiết tour</DialogTitle>
            <DialogContent>
              <Typography>Tên tour: {selectedTour.TENTOUR}</Typography>
              <Typography>Loại tour: {selectedTour.LOAITOUR}</Typography>
              <Typography>Giá: {parseFloat(selectedTour.GIA).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
              <Typography>Số vé: {selectedTour.SOVE}</Typography>
              <Typography>Trạng thái: {selectedTour.TRANGTHAI}</Typography>
              <Typography>Mô tả: {selectedTour.MOTA}</Typography>
              <Typography>ID lịch trình: {selectedTour.IDLICHTRINH}</Typography>
              <Typography>Phương tiện di chuyển: {selectedTour.PHUONGTIENDICHUYEN}</Typography>
              <Typography>Địa điểm khởi hành: {selectedTour.KHOIHANH}</Typography>
              {/* Hiển thị hình ảnh của tour */}
              <Box marginTop={2}>
              <Typography>Hình ảnh tour</Typography>
              <img
                src={`http://localhost:5000/${selectedTour.HINHANH}`} 
                alt={selectedTour.TENTOUR}
                style={{ width: '100%', height: 'auto' }}
              />
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default TourManagement;