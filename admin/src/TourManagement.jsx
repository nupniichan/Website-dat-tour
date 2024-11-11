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
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp, LocationOn, CalendarToday, AttachMoney, ConfirmationNumber, Category, Description, DirectionsBus, Schedule, Image as ImageIcon, ArrowBack } from '@mui/icons-material';
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
        .then(async response => {
            const data = await response.json();
            
            if (!response.ok) {
                // Nếu status không phải 2xx, ném lỗi với message từ server
                throw new Error(data.error || 'Có lỗi xảy ra khi xóa tour');
            }
            
            // Nếu thành công
            fetchTours();
            alert('Xóa tour thành công');
        })
        .catch(err => {
            // Hiển thị thông báo lỗi
            alert(err.message);
            console.error('Error deleting tour:', err);
        });
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
                <Typography variant="h6">Chi tiết Tour</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 2 }}>
                {/* Thông tin cơ bản */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category /> Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Tên tour</Typography>
                      <Typography variant="body1" fontWeight="500">{selectedTour.TENTOUR}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Loại tour</Typography>
                      <Chip 
                        label={selectedTour.LOAITOUR}
                        color="info"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                      <Chip 
                        label={selectedTour.TRANGTHAI}
                        color={selectedTour.TRANGTHAI === 'Còn vé' ? 'success' : 'error'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Thông tin chi tiết */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description /> Thông tin chi tiết
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachMoney color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Giá tour</Typography>
                          <Typography variant="body1" fontWeight="bold" color="error">
                            {parseFloat(selectedTour.GIA).toLocaleString('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ConfirmationNumber color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Số vé</Typography>
                          <Typography variant="body1" fontWeight="500">{selectedTour.SOVE}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                        <Description color="primary" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Mô tả</Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedTour.MOTA}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Thông tin lịch trình */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule /> Thông tin lịch trình
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarToday color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Ngày đi</Typography>
                          <Typography variant="body1">{formatDate(selectedTour.NGAYDI)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarToday color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Ngày về</Typography>
                          <Typography variant="body1">{formatDate(selectedTour.NGAYVE)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Điểm khởi hành</Typography>
                          <Typography variant="body1">{selectedTour.KHOIHANH}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsBus color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Phương tiện di chuyển</Typography>
                          <Typography variant="body1">{selectedTour.PHUONGTIENDICHUYEN}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Hình ảnh tour */}
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon /> Hình ảnh tour
                  </Typography>
                  <Box sx={{ 
                    mt: 2, 
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& img': {
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }
                  }}>
                    <img
                      src={`http://localhost:5000/${selectedTour.HINHANH}`}
                      alt={selectedTour.TENTOUR}
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  </Box>
                </Paper>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default TourManagement;