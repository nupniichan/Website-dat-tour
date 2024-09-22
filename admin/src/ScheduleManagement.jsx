import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const navigate = useNavigate();

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
  }, [searchTerm, schedules]);

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
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error deleting schedule');
        }
      })
      .then(data => {
        fetchSchedules(); // Cập nhật lại danh sách lịch trình
      })
      .catch(err => console.error('Error deleting schedule:', err));
    }
  };

  // Handle view details button click
  const handleViewDetails = (id) => {
    navigate(`/schedule/${id}`);
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
          {filteredSchedules.map((schedule) => (
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

      {selectedSchedule && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết lịch trình</DialogTitle>
          <DialogContent>
            <Typography>Tên lịch trình: {selectedSchedule.tenlichtrinh}</Typography>
            <Typography>Ngày đi: {new Date(selectedSchedule.NGAYDI).toLocaleDateString('vi-VN')}</Typography>
            <Typography>Ngày về: {new Date(selectedSchedule.NGAYVE).toLocaleDateString('vi-VN')}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ScheduleManagement;
