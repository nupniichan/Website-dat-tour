import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField, IconButton, Grid, Paper, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector
} from '@mui/lab';
import {
  Schedule as ScheduleIcon,
  CalendarToday,
  LocationOn,
  AccessTime,
  Description,
  ArrowBack
} from '@mui/icons-material';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Fetch schedules from the backend
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    fetch('http://localhost:5000/schedules')
      .then(response => response.json())
      .then(data => {
        setSchedules(data);
        setFilteredSchedules(data);
      })
      .catch(err => console.error('Error fetching schedules:', err));
  };

  // Filter schedules based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredSchedules(schedules.filter(schedule =>
        schedule.tenlichtrinh.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredSchedules(schedules);
    }
    setPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm, schedules]);

  // Tính toán các giá trị cho phân trang
  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, startIndex + rowsPerPage);

  // Xử lý khi thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Navigate to add schedule page
  const handleAddScheduleClick = () => {
    navigate('/add-schedule');
  };

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/edit-schedule/${id}`);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá lịch trình này không?')) {
      fetch(`http://localhost:5000/delete-schedule/${id}`, {
        method: 'DELETE',
      })
      .then(async response => {
        // Đọc nội dung response
        const data = await response.json();
        
        if (!response.ok) {
          // Nếu status không phải 2xx, ném lỗi với message từ server
          throw new Error(data.error || 'Có lỗi xảy ra khi xóa lịch trình');
        }
        
        // Nếu thành công
        fetchSchedules();
        alert('Xóa lịch trình thành công');
      })
      .catch(err => {
        // Hiển thị thông báo lỗi
        alert(err.message);
        console.error('Error deleting schedule:', err);
      });
    }
  };

  // Handle view details button click
  const handleViewDetails = (id) => {
    fetch(`http://localhost:5000/schedules/${id}`)
      .then(response => response.json())
      .then(data => {
        setSelectedSchedule(data);
      })
      .catch(err => console.error('Error fetching schedule details:', err));
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedSchedule(null);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý lịch trình</h3>

      <Button variant="contained" style={{ backgroundColor: '#FFA500', color: 'white' }} onClick={handleAddScheduleClick}>
        Thêm lịch trình
      </Button>

      {/* Search input */}
      <TextField
        label="Tìm kiếm theo tên lịch trình"
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
            <TableCell>Tên lịch trình</TableCell>
            <TableCell>Ngày đi</TableCell>
            <TableCell>Ngày về</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentSchedules.map((schedule) => (
            <TableRow key={schedule.ID}>
              <TableCell>{schedule.ID}</TableCell>
              <TableCell>{schedule.tenlichtrinh}</TableCell>
              <TableCell>{new Date(schedule.NGAYDI).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{new Date(schedule.NGAYVE).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined" 
                  onClick={() => handleViewDetails(schedule.ID)} 
                >
                  Xem Chi tiết
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => handleEdit(schedule.ID)} 
                  style={{ marginLeft: '10px' }}
                >
                  Sửa
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => handleDelete(schedule.ID)} 
                  style={{ marginLeft: '10px' }}
                >
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

      {selectedSchedule && (
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
              <Typography variant="h6">Chi tiết lịch trình</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              {/* Thông tin cơ bản */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon /> Thông tin lịch trình
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Tên lịch trình</Typography>
                    <Typography variant="h6" fontWeight="500">{selectedSchedule.tenlichtrinh}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Ngày đi</Typography>
                        <Typography variant="body1">
                          {new Date(selectedSchedule.NGAYDI).toLocaleDateString('vi-VN', {
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
                        <Typography variant="subtitle2" color="text.secondary">Ngày về</Typography>
                        <Typography variant="body1">
                          {new Date(selectedSchedule.NGAYVE).toLocaleDateString('vi-VN', {
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

              {/* Chi tiết lịch trình */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description /> Chi tiết các hoạt động
                </Typography>
                
                <Timeline>
                  {selectedSchedule.details?.map((detail, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index < selectedSchedule.details.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="primary">
                              {new Date(detail.NGAY).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="primary">
                              {detail.GIO}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="500" gutterBottom>
                            {detail.SUKIEN}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              bgcolor: 'background.paper',
                              p: 1.5,
                              borderRadius: 1,
                              border: '1px dashed rgba(0, 0, 0, 0.12)'
                            }}
                          >
                            {detail.MOTA}
                          </Typography>
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ScheduleManagement;
