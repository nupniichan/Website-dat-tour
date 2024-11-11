import React, { useState } from 'react';
import {
  Box, TextField, Button, IconButton, Typography,
  Card, CardContent, Divider, Grid, Paper,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Alert, Tooltip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AddSchedule = () => {
  const [schedule, setSchedule] = useState({ name: '', startDate: '', endDate: '' });
  const [details, setDetails] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [descriptionContent, setDescriptionContent] = useState(''); // Thêm trạng thái này
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventContent') setEventContent(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'descriptionContent') setDescriptionContent(value); // Thêm dòng này
  };

  const validateDetail = () => {
    let tempErrors = {};

    // Kiểm tra ngày
    if (!eventDate) {
      tempErrors.eventDate = "Ngày không được để trống";
    } else {
      const detailDate = new Date(eventDate);
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      if (!schedule.startDate || !schedule.endDate) {
        tempErrors.eventDate = "Vui lòng nhập ngày đi và ngày về trước";
      } else if (detailDate < startDate || detailDate > endDate) {
        tempErrors.eventDate = "Ngày phải nằm trong khoảng thời gian của lịch trình";
      }
    }

    // Kiểm tra nội dung sự kiện
    if (!eventContent.trim()) {
      tempErrors.eventContent = "Sự kiện không được để trống";
    }

    // Kiểm tra thời gian
    if (!eventTime) {
      tempErrors.eventTime = "Thời gian không được để trống";
    }

    // Reset errors trước khi set errors mới
    setErrors({});
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddDetail = () => {
    if (validateDetail()) {
      const newDetail = {
        date: eventDate,
        content: eventContent,
        description: descriptionContent,
        time: eventTime
      };

      // Thêm chi tiết mới và sắp xếp lại theo thời gian
      setDetails(prev => {
        const updatedDetails = [...prev, newDetail].sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        return updatedDetails;
      });

      // Reset form và errors
      setEventDate('');
      setEventContent('');
      setEventTime('');
      setDescriptionContent('');
      setErrors({}); // Reset errors sau khi thêm thành công
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);

    // Validate tên lịch trình
    if (!schedule.name.trim()) {
      tempErrors.name = "Tên lịch trình không được để trống";
    }

    // Validate ngày đi
    if (!schedule.startDate) {
      tempErrors.startDate = "Ngày đi không được để trống";
    } else if (startDate < currentDate) {
      tempErrors.startDate = "Ngày đi không được là ngày trong quá khứ";
    }

    // Validate ngày về
    if (!schedule.endDate) {
      tempErrors.endDate = "Ngày về không được để trống";
    } else {
      if (endDate < currentDate) {
        tempErrors.endDate = "Ngày về không được là ngày trong quá khứ";
      }
      if (endDate < startDate) {
        tempErrors.endDate = "Ngày về phải sau ngày đi";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const data = {
      ...schedule,
      details,
    };
    
    fetch('http://localhost:5000/add-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Schedule added:', data);
        navigate('/'); 
      })
      .catch(err => console.error('Error adding schedule:', err));
  };

  const formatDisplayDate = (dateString) => {
    // Tách ngày tháng năm từ chuỗi YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    // Return định dạng dd/MM/yyyy
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Thêm lịch trình mới
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Thông tin cơ bản */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thông tin cơ bản
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Tên lịch trình"
                        fullWidth
                        name="name"
                        value={schedule.name}
                        onChange={handleChange}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày đi"
                        type="date"
                        fullWidth
                        name="startDate"
                        value={schedule.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày về"
                        type="date"
                        fullWidth
                        name="endDate"
                        value={schedule.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Chi tiết lịch trình */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Thêm chi tiết lịch trình
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày"
                        type="date"
                        fullWidth
                        name="eventDate"
                        value={eventDate}
                        onChange={handleDetailChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.eventDate}
                        helperText={errors.eventDate}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Giờ"
                        type="time"
                        fullWidth
                        name="eventTime"
                        value={eventTime}
                        onChange={handleDetailChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.eventTime}
                        helperText={errors.eventTime}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Sự kiện"
                        fullWidth
                        name="eventContent"
                        value={eventContent}
                        onChange={handleDetailChange}
                        error={!!errors.eventContent}
                        helperText={errors.eventContent}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        name="descriptionContent"
                        value={descriptionContent}
                        onChange={handleDetailChange}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleAddDetail}
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                      >
                        Thêm chi tiết
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Danh sách chi tiết */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                    Danh sách chi tiết lịch trình
                  </Typography>
                  
                  {details.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Chưa có chi tiết nào được thêm
                    </Alert>
                  ) : (
                    <List>
                      {details.map((detail, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            bgcolor: 'white',
                            mb: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1">
                                  {formatDisplayDate(detail.date)}
                                </Typography>
                                <AccessTimeIcon color="primary" fontSize="small" sx={{ ml: 2 }} />
                                <Typography variant="subtitle1">
                                  {detail.time}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body1" color="text.primary">
                                  {detail.content}
                                </Typography>
                                {detail.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {detail.description}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Xóa chi tiết">
                              <IconButton
                                edge="end"
                                onClick={() => {
                                  const newDetails = [...details];
                                  newDetails.splice(index, 1);
                                  setDetails(newDetails);
                                }}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Lưu lịch trình
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddSchedule;
